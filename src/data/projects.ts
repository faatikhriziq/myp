export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  highlights: string[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
  context: string;
  problem: string;
  approach: string[];
  architecture: Array<{
    label: string;
    description: string;
  }>;
  decisions: Array<{
    title: string;
    body: string;
  }>;
  tradeoffs: Array<{
    title: string;
    body: string;
  }>;
  lessons: string[];
};

export const projects: Project[] = [
  {
    slug: 'erp-system',
    title: 'ERP System',
    subtitle: 'Modular monolith architecture for production-grade enterprise workflows.',
    description:
      'A production-grade enterprise resource planning system built with modular monolith architecture. Designed for module isolation, reliable cross-module communication, and maintainability as the domain grows.',
    stack: ['Go', 'PostgreSQL', 'Outbox Pattern', 'Schema-per-Module'],
    highlights: [
      'Modular monolith with enforced schema boundaries per module',
      'Outbox pattern for transactionally consistent event publishing',
      'In-process module communication through explicit interface contracts',
      'Single deployment unit with reduced operational complexity',
    ],
    metrics: [
      { label: 'Architecture', value: 'Modular monolith' },
      { label: 'Database model', value: 'Schema isolation' },
      { label: 'Reliability', value: 'Transactional events' },
    ],
    context:
      'The system needed to support growing ERP domains without turning every module into an independent service. The main challenge was keeping boundaries clear while preserving deployment and operational simplicity.',
    problem:
      'A traditional layered monolith would make feature delivery fast at first, but domain boundaries would become harder to enforce as modules started sharing tables, services, and implicit assumptions.',
    approach: [
      'Model each business capability as an explicit module with its own application contracts.',
      'Use PostgreSQL schema-per-module isolation so database ownership is visible and enforceable.',
      'Keep module communication in-process, but only through interfaces rather than direct database access.',
      'Publish cross-module events through an outbox table written in the same transaction as business data.',
    ],
    architecture: [
      {
        label: 'HTTP/API Layer',
        description: 'Receives requests and delegates use cases without owning domain logic.',
      },
      {
        label: 'Module Boundary',
        description: 'Each module exposes explicit interfaces and hides persistence details.',
      },
      {
        label: 'PostgreSQL Schemas',
        description: 'Separate schemas make ownership and accidental coupling easier to control.',
      },
      {
        label: 'Outbox Worker',
        description: 'Dispatches domain events reliably after the transaction commits.',
      },
    ],
    decisions: [
      {
        title: 'Choose modular monolith before microservices',
        body: 'The system needed strong boundaries, not distributed systems overhead. A single deployable kept operations simpler while still allowing modules to evolve independently.',
      },
      {
        title: 'Use schema-per-module instead of shared public tables',
        body: 'Database ownership is one of the easiest boundaries to accidentally break. Separate schemas make ownership visible during development and review.',
      },
      {
        title: 'Use outbox for cross-module events',
        body: 'Publishing events outside the database transaction risks losing messages. The outbox pattern keeps state changes and event intent consistent.',
      },
    ],
    tradeoffs: [
      {
        title: 'Less runtime isolation than microservices',
        body: 'A module bug can still affect the single process, but the tradeoff keeps deployment, tracing, and local development far simpler.',
      },
      {
        title: 'More discipline required in code review',
        body: 'The architecture only works if boundaries are actively maintained. Interface contracts and schema ownership need to be reviewed consistently.',
      },
    ],
    lessons: [
      'Boundaries should be visible in code and in the database, not only in diagrams.',
      'A monolith can stay maintainable if module ownership is explicit from the beginning.',
      'Reliable event publishing is a data consistency problem before it is an infrastructure problem.',
    ],
  },
  {
    slug: 'xplore',
    title: 'Xplore',
    subtitle: 'Location-based travel RPG concept built around spatial verification.',
    description:
      'A travel RPG concept app where users discover and verify real-world locations through GPS. Designed with spatial data architecture and event-driven verification flow.',
    stack: ['Go', 'PostgreSQL', 'PostGIS', 'Event-Driven', 'GPS Verification'],
    highlights: [
      'GPS-based location verification using PostGIS spatial queries',
      'Event-driven verification flow to decouple check-in from reward processing',
      'Spatial indexing for efficient proximity-based location discovery',
      'Gamification layer with XP, levels, and location-based achievements',
    ],
    metrics: [
      { label: 'Domain', value: 'Travel RPG' },
      { label: 'Core data', value: 'Spatial queries' },
      { label: 'Flow', value: 'Event-driven' },
    ],
    context:
      'Xplore explores how travel discovery can feel more engaging by combining real-world location verification with RPG-style progression.',
    problem:
      'Location-based products need to balance accuracy, battery usage, anti-cheat concerns, and a reward system that does not block the check-in experience.',
    approach: [
      'Store locations with PostGIS geometry types and proximity indexes.',
      'Verify user check-ins against distance thresholds rather than exact coordinate equality.',
      'Treat verification and reward processing as separate steps connected by events.',
      'Keep gamification rules isolated so XP, achievements, and levels can evolve independently.',
    ],
    architecture: [
      {
        label: 'Discovery API',
        description: 'Returns nearby locations using indexed spatial queries.',
      },
      {
        label: 'Verification Service',
        description: 'Checks submitted GPS coordinates against allowed location radius.',
      },
      {
        label: 'Event Stream',
        description: 'Emits verified check-in events for downstream reward handling.',
      },
      {
        label: 'Progression Engine',
        description: 'Applies XP, levels, and achievement rules without blocking verification.',
      },
    ],
    decisions: [
      {
        title: 'Use PostGIS for location primitives',
        body: 'Spatial queries are core to the product. PostGIS provides the right indexing and distance operations without inventing custom coordinate logic.',
      },
      {
        title: 'Decouple check-in from reward processing',
        body: 'A verified check-in should return quickly. Reward calculation can happen asynchronously so gamification rules stay flexible.',
      },
      {
        title: 'Design around tolerance, not exact GPS matches',
        body: 'Mobile GPS is noisy. Radius-based verification creates a more realistic user experience than exact coordinate matching.',
      },
    ],
    tradeoffs: [
      {
        title: 'Verification is probabilistic',
        body: 'GPS radius checks improve usability, but they require additional thinking around spoofing and trust signals.',
      },
      {
        title: 'Events add eventual consistency',
        body: 'Rewards may appear after verification instead of immediately, but the flow stays more resilient and extensible.',
      },
    ],
    lessons: [
      'Spatial products need data modeling decisions early, not as an afterthought.',
      'Gamification is easier to evolve when it is separated from the core verification flow.',
      'User experience and correctness need to meet in the middle for real-world GPS features.',
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
