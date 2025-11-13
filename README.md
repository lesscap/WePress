# WePress

A pnpm monorepo application with frontend and backend.

## Project Structure

```
WePress/
├── packages/
│   ├── ui/          # React + TypeScript frontend
│   └── web/         # Fastify backend
├── package.json     # Root configuration
└── pnpm-workspace.yaml
```

## Tech Stack

- **Frontend (ui)**: React, TypeScript, Vite, Vitest
- **Backend (web)**: Fastify, TypeScript, tsx, Vitest
- **Tools**: pnpm workspace, Biome (formatter and linter)

## Development

```bash
# Install dependencies
pnpm install

# Run dev mode for all packages
pnpm dev

# Run frontend only
pnpm --filter @wepress/ui dev

# Run backend only
pnpm --filter @wepress/web dev
```

## Build

```bash
# Build all packages
pnpm build

# Build frontend only
pnpm --filter @wepress/ui build

# Build backend only
pnpm --filter @wepress/web build
```

## Other Commands

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test
```

## Environment Variables

Backend requires environment variables. See `packages/web/.env.example`:

```bash
cd packages/web
cp .env.example .env
```
