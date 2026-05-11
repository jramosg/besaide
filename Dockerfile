# Build stage
FROM node:22-alpine AS builder
ENV ASTRO_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# Copy only lock files first (cache dependencies separately)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Install dependencies (allow build scripts for native modules)
RUN pnpm install --frozen-lockfile && pnpm approve-builds

# Copy source code (invalidates cache only if source changes)
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV ASTRO_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./

EXPOSE 1234

USER node

CMD ["node", "/app/dist/server/entry.mjs"]
