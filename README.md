# faatikhriziq.my.id

Personal portfolio & blog built with [Astro](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Local Development

```sh
pnpm install
pnpm dev
```

Dev server runs at `http://localhost:4321`.

## Build

```sh
pnpm build
pnpm preview
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages) and create a new project
3. Connect your GitHub repo
4. Set build settings:
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Node.js version:** `22` (set via environment variable `NODE_VERSION`)
5. Add custom domain `faatikhriziq.my.id` in the Pages project settings

## Blog

Blog posts live in `src/content/blog/` as `.md` or `.mdx` files.

Frontmatter schema:

```yaml
---
title: "Post Title"
description: "Short description"
pubDate: 2025-06-15
tags: ["tag1", "tag2"]
draft: false
---
```

Set `draft: true` to hide a post from the published listing.

## Stack

- Astro (static output)
- @astrojs/cloudflare adapter
- @astrojs/sitemap
- @astrojs/mdx
- Self-hosted Inter & JetBrains Mono fonts
