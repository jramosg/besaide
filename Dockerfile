# Build stage
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

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

# Create logs directory
RUN mkdir -p /app/logs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 1234

CMD ["node", "/app/dist/server/entry.mjs"]
