# brucechau.dev

A personal blog and digital garden built with Astro 7, React islands, MDX, Bun, and deployed as a static site on Cloudflare Pages.

## Local development

```bash
bun install
bun run dev
```

The site runs at `http://localhost:3434`.

## Write a post

Create an `.mdx` file inside `src/content/blog` and add validated frontmatter:

```mdx
---
title: My new note
description: A short summary.
publishedAt: 2026-09-29
category: tech
tags: [astro]
featured: false
---

Start writing here.
```

Images that should be served unchanged belong in `public/images`. Reference them from MDX as `/images/file-name.webp`.

## Quality checks

```bash
bun run check
bun run build
```

## Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages and use:

- Build command: `bun run build`
- Build output directory: `dist`
- Environment variable: `BUN_VERSION=1.3.14`

Every push can create a preview deployment; pushes to `main` publish production. For a manual deployment after authenticating Wrangler:

```bash
bun run deploy:pages
```

Copy `.env.example` to `.env` and update the three `PUBLIC_*_URL` values for the homepage social buttons. The same variables must be added to Cloudflare Pages. The remaining variables enable Google Calendar booking, Giscus comments, and Umami analytics.
