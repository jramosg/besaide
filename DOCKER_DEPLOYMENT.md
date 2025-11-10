# Docker Deployment Guide

This guide explains how to deploy the Besaide Astro application using Docker for optimal performance.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start the container:**
   ```bash
   pnpm run docker:compose:build
   ```

2. **Access the application:**
   - Open your browser at `http://localhost:4321`

3. **Stop the container:**
   ```bash
   pnpm run docker:stop
   ```

### Using Docker directly

1. **Build the Docker image:**
   ```bash
   pnpm run docker:build
   ```

2. **Run the container:**
   ```bash
   pnpm run docker:run
   ```

## Performance Optimizations

The Docker setup includes several optimizations for fast page delivery:

1. **Multi-stage build**: Reduces final image size by separating build and runtime stages
2. **Alpine Linux**: Lightweight base image for faster container startup
3. **Node.js Adapter**: Configured in standalone mode for optimal SSR performance
4. **Vite optimizations**: Enabled minification for CSS and JavaScript
5. **Production mode**: Runs with `NODE_ENV=production` for best performance

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 4321)
- `NODE_ENV`: Environment mode (production)
- `PUBLIC_SITE_URL`: Your site URL

### Port Configuration

To change the exposed port, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:4321"  # Change 8080 to your desired port
```

## Production Deployment

### Option 1: Docker Compose

```bash
docker-compose up -d --build
```

### Option 2: Docker with custom settings

```bash
docker build -t besaide:latest .
docker run -d \
  -p 4321:4321 \
  -e NODE_ENV=production \
  --name besaide-app \
  --restart unless-stopped \
  besaide:latest
```

### Option 3: Behind a Reverse Proxy (Nginx/Traefik)

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

### View logs

```bash
docker-compose logs -f besaide
```

### Check container status

```bash
docker-compose ps
```

### Health check

The container includes a health check that runs every 30 seconds to ensure the application is responsive.

## Troubleshooting

### Container won't start

1. Check logs: `docker-compose logs besaide`
2. Verify port 4321 is not already in use
3. Ensure sufficient disk space for the build

### Performance issues

1. Increase Node.js memory limit in `docker-compose.yml`:
   ```yaml
   environment:
     - NODE_OPTIONS=--max-old-space-size=4096
   ```

2. Enable caching in your reverse proxy
3. Consider using a CDN for static assets

## Additional Scripts

- `pnpm run docker:build` - Build Docker image
- `pnpm run docker:run` - Run container directly
- `pnpm run docker:compose` - Start with docker-compose
- `pnpm run docker:compose:build` - Rebuild and start
- `pnpm run docker:stop` - Stop containers

## Notes

- The application runs in SSR (Server-Side Rendering) mode for optimal performance
- Static assets are bundled within the container
- The health check ensures the container is running correctly
- Automatic restart is configured unless manually stopped
