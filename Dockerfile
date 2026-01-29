# Build stage
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only lock files first (cache dependencies separately)
COPY pnpm-lock.yaml .npmrc package.json ./

# Install dependencies (allow build scripts for native modules)
# This layer is cached until pnpm-lock.yaml or package.json changes
RUN pnpm install --frozen-lockfile

# Copy source code (invalidates cache only if source changes)
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

RUN apk add --no-cache nginx supervisor

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Create nginx cache directory
RUN mkdir -p /var/cache/nginx

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
