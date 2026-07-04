---
title: "Building an ERP System with Modular Monolith Architecture"
description: "Lessons learned from designing a production-grade ERP system using Go and PostgreSQL — with schema-per-module isolation, outbox pattern for reliable messaging, and modular boundaries that actually hold."
pubDate: 2025-06-15
tags: ["go", "postgresql", "architecture", "modular-monolith"]
draft: false
---

When I started building our ERP system, the first architectural decision wasn't about which framework to use — it was about **boundaries**. How do you split a monolithic domain like enterprise resource planning into modules that can evolve independently, without prematurely paying the distributed systems tax?

## Why Modular Monolith?

Microservices were the obvious "modern" answer. But for a team of our size, the operational overhead was unjustifiable. We needed module isolation without network boundaries.

The modular monolith gave us:

- **Schema-per-module** in PostgreSQL — each module owns its tables in a dedicated schema, enforced at the connection level
- **In-process communication** with explicit contracts — modules talk through well-defined interfaces, not direct database queries across schemas
- **Single deployment unit** — one binary, one deploy pipeline, one set of logs to grep through at 2am

## The Outbox Pattern

The trickiest part was reliable event publishing. When a module changes state and needs to notify others, you can't just fire an event and hope for the best. If the event publish fails after the database commit, you have inconsistency.

The outbox pattern solved this elegantly:

```go
func (s *SalesService) CreateOrder(ctx context.Context, order Order) error {
    return s.db.WithTx(ctx, func(tx *sql.Tx) error {
        if err := s.repo.Insert(tx, order); err != nil {
            return err
        }
        return s.outbox.Publish(tx, "order.created", order)
    })
}
```

The event is written to an `outbox` table **in the same transaction** as the business data. A background worker polls the outbox and dispatches events. At-least-once delivery, guaranteed.

## Schema-per-Module in Practice

Each module gets its own PostgreSQL schema:

```sql
CREATE SCHEMA sales;
CREATE SCHEMA inventory;
CREATE SCHEMA accounting;
```

Module database connections are scoped to their schema via `search_path`. This means a module literally **cannot** accidentally query another module's tables.

## Key Takeaways

1. **Start with clear module boundaries** — if you can't draw the boundary on a whiteboard, your code won't enforce it either
2. **The outbox pattern is non-negotiable** for reliable cross-module communication in a monolith
3. **Schema isolation is cheap and effective** — it's a fraction of the complexity of separate databases, with most of the benefits
4. **Resist the urge to share tables** — the moment two modules write to the same table, your boundaries are fiction

The modular monolith isn't glamorous, but it ships. And when (if) the time comes to extract a module into a service, the boundaries are already there.
