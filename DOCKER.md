# Docker Guide for PigeonHole Web UI

This guide covers building and running the PigeonHole web application using Docker.

## Quick Start

### Using Makefile (Recommended)

The easiest way to work with Docker:

```bash
# Build and run in one command
make run

# Or step by step:
make docker-build
make docker-run

# View logs
make docker-logs

# Stop container
make docker-stop
```

### Using Docker CLI

```bash
# Build the image
docker build \
  --build-arg VITE_AUTH0_CLIENT_ID=your_client_id \
  --build-arg VITE_API_BASE_URL=https://api.pigeonhole.io/v1 \
  -t pigeonhole-web:latest .

# Run the container
docker run -d \
  --name pigeonhole-web \
  -p 8080:80 \
  pigeonhole-web:latest

# Access at http://localhost:8080
```

### Using Docker Compose

```bash
# Create .env file (or set environment variables)
echo "VITE_AUTH0_CLIENT_ID=your_client_id" > .env
echo "VITE_API_BASE_URL=https://api.pigeonhole.io/v1" >> .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Makefile Commands

### Development Commands

```bash
make help              # Show all available commands
make install           # Install npm dependencies
make dev               # Run development server (port 3000)
make build             # Build production bundle
make preview           # Preview production build
make clean             # Clean build artifacts
```

### Docker Commands

```bash
make docker-build      # Build Docker image with production settings
make docker-build-dev  # Build Docker image with dev settings
make docker-run        # Run container in background (port 8080)
make docker-run-fg     # Run container in foreground (for debugging)
make docker-stop       # Stop and remove container
make docker-logs       # View container logs
make docker-shell      # Open shell in running container
make docker-push       # Push image to registry
make docker-clean      # Remove image and containers
```

### Docker Compose Commands

```bash
make compose-up        # Start services
make compose-down      # Stop services
make compose-logs      # View logs
make compose-restart   # Restart services
```

### Quick Actions

```bash
make setup            # Complete setup (env + install)
make run              # Build and run Docker container
make restart          # Restart Docker container
make status           # Show container and build status
make info             # Show project information
```

## Docker Architecture

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimization:

1. **Build Stage** (node:18-alpine)
   - Installs dependencies
   - Builds production bundle
   - Creates optimized dist/ directory

2. **Production Stage** (nginx:alpine)
   - Serves static files via nginx
   - Minimal image size (~50MB)
   - Production-ready configuration

### Image Details

- **Base Image**: nginx:alpine
- **Size**: ~50MB (compressed)
- **Port**: 80 (internal), mapped to 8080 (external)
- **Healthcheck**: Enabled (checks every 30s)
- **Restart Policy**: unless-stopped

## Configuration

### Build Arguments

Pass these during build:

```bash
docker build \
  --build-arg VITE_AUTH0_CLIENT_ID=your_client_id \
  --build-arg VITE_API_BASE_URL=https://api.pigeonhole.io/v1 \
  -t pigeonhole-web:latest .
```

Or set in Makefile:

```bash
make docker-build \
  AUTH0_CLIENT_ID=your_client_id \
  API_BASE_URL=https://api.pigeonhole.io/v1
```

### Environment Variables

For docker-compose, create `.env` file:

```env
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_API_BASE_URL=https://api.pigeonhole.io/v1
PORT=8080
```

### Port Configuration

Default port is 8080. To use a different port:

```bash
# Using Makefile
make docker-run DOCKER_PORT=3000

# Using Docker CLI
docker run -d -p 3000:80 --name pigeonhole-web pigeonhole-web:latest

# Using docker-compose
PORT=3000 docker-compose up -d
```

## nginx Configuration

The container uses a custom nginx configuration (`nginx.conf`) with:

- **Gzip compression**: Enabled for text/css/js/json
- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **SPA routing**: All routes serve index.html
- **Cache control**:
  - Static assets: 1 year cache
  - index.html: no-cache
- **Healthcheck endpoint**: / returns 200

### Custom nginx Configuration

To modify nginx settings:

1. Edit `nginx.conf`
2. Rebuild image: `make docker-build`
3. Restart container: `make restart`

## Development Workflow

### Local Development (Without Docker)

```bash
# Setup
make setup

# Run dev server
make dev

# Build
make build
```

### Docker Development

```bash
# Build with dev settings
make docker-build-dev

# Run in foreground to see logs
make docker-run-fg

# Or run in background
make docker-run
make docker-logs
```

## Production Deployment

### Building Production Image

```bash
# Build with production settings
make docker-build \
  AUTH0_CLIENT_ID=prod_client_id \
  API_BASE_URL=https://api.pigeonhole.io/v1 \
  VERSION=1.0.0
```

### Pushing to Registry

```bash
# Tag and push
make docker-push DOCKER_REGISTRY=ghcr.io/yourorg

# Or manually
docker tag pigeonhole-web:latest ghcr.io/yourorg/pigeonhole-web:latest
docker push ghcr.io/yourorg/pigeonhole-web:latest
```

### Running in Production

```bash
# Pull and run
docker pull ghcr.io/yourorg/pigeonhole-web:latest
docker run -d \
  --name pigeonhole-web \
  -p 80:80 \
  --restart always \
  ghcr.io/yourorg/pigeonhole-web:latest
```

## Debugging

### View Logs

```bash
# Using Makefile
make docker-logs

# Using Docker CLI
docker logs -f pigeonhole-web

# Using docker-compose
docker-compose logs -f web
```

### Access Container Shell

```bash
# Using Makefile
make docker-shell

# Using Docker CLI
docker exec -it pigeonhole-web sh

# Check nginx configuration
docker exec pigeonhole-web nginx -t

# View nginx logs
docker exec pigeonhole-web cat /var/log/nginx/access.log
```

### Inspect Container

```bash
# Container details
docker inspect pigeonhole-web

# Resource usage
docker stats pigeonhole-web

# Processes
docker top pigeonhole-web
```

### Healthcheck

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' pigeonhole-web

# View healthcheck logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' pigeonhole-web
```

## Troubleshooting

### Container Won't Start

1. **Check logs**:
   ```bash
   docker logs pigeonhole-web
   ```

2. **Verify nginx configuration**:
   ```bash
   docker run --rm pigeonhole-web:latest nginx -t
   ```

3. **Check port conflicts**:
   ```bash
   lsof -i :8080
   # Or use different port
   make docker-run DOCKER_PORT=8081
   ```

### Build Fails

1. **Clear Docker cache**:
   ```bash
   docker build --no-cache -t pigeonhole-web:latest .
   ```

2. **Check build logs**:
   ```bash
   docker build -t pigeonhole-web:latest . 2>&1 | tee build.log
   ```

3. **Verify environment variables**:
   ```bash
   make info
   ```

### Application Not Loading

1. **Check nginx is running**:
   ```bash
   docker exec pigeonhole-web ps aux | grep nginx
   ```

2. **Test from inside container**:
   ```bash
   docker exec pigeonhole-web wget -O- http://localhost
   ```

3. **Check file permissions**:
   ```bash
   docker exec pigeonhole-web ls -la /usr/share/nginx/html/
   ```

### Performance Issues

1. **Check resource usage**:
   ```bash
   docker stats pigeonhole-web
   ```

2. **Limit container resources**:
   ```bash
   docker run -d \
     --name pigeonhole-web \
     --memory="512m" \
     --cpus="1.0" \
     -p 8080:80 \
     pigeonhole-web:latest
   ```

## Best Practices

### Security

1. **Don't hardcode secrets in Dockerfile**
   - Use build args
   - Use environment variables
   - Use Docker secrets for sensitive data

2. **Run as non-root** (already configured in nginx:alpine)

3. **Keep images updated**:
   ```bash
   docker pull nginx:alpine
   make docker-build
   ```

4. **Scan for vulnerabilities**:
   ```bash
   docker scan pigeonhole-web:latest
   ```

### Optimization

1. **Use .dockerignore** (already configured)
   - Excludes node_modules, .git, etc.
   - Reduces build context size

2. **Multi-stage builds** (already implemented)
   - Smaller final image
   - No build dependencies in production

3. **Layer caching**:
   ```bash
   # Copy package.json first for better caching
   COPY package*.json ./
   RUN npm ci
   COPY . .
   ```

### Monitoring

1. **Enable logging**:
   ```bash
   docker-compose logs -f --tail=100
   ```

2. **Set up healthchecks** (already configured)

3. **Use container orchestration** (Kubernetes, Docker Swarm)

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          make docker-build \
            AUTH0_CLIENT_ID=${{ secrets.AUTH0_CLIENT_ID }} \
            API_BASE_URL=${{ secrets.API_BASE_URL }}

      - name: Push to registry
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          make docker-push DOCKER_REGISTRY=ghcr.io/${{ github.repository_owner }}
```

### GitLab CI

```yaml
docker-build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - make docker-build AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
    - make docker-push DOCKER_REGISTRY=$CI_REGISTRY_IMAGE
```

## Advanced Usage

### Custom Build Versions

```bash
# Build specific version
make docker-build VERSION=1.2.3

# Tag multiple versions
docker tag pigeonhole-web:latest pigeonhole-web:1.2.3
docker tag pigeonhole-web:latest pigeonhole-web:1.2
docker tag pigeonhole-web:latest pigeonhole-web:1
```

### Volume Mounts (for development)

```bash
# Mount source code for live reloading
docker run -it --rm \
  -v $(pwd)/src:/app/src \
  -p 3000:3000 \
  node:18-alpine \
  sh -c "cd /app && npm install && npm run dev"
```

### Network Configuration

```bash
# Create custom network
docker network create pigeonhole-net

# Run with custom network
docker run -d \
  --name pigeonhole-web \
  --network pigeonhole-net \
  -p 8080:80 \
  pigeonhole-web:latest
```

## Cleanup

### Remove All Containers and Images

```bash
# Using Makefile
make docker-clean

# Manual cleanup
docker stop pigeonhole-web
docker rm pigeonhole-web
docker rmi pigeonhole-web:latest

# Clean everything (careful!)
docker system prune -a
```

### Free Up Space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## Support

For Docker-related issues:

1. Check this guide
2. View container logs: `make docker-logs`
3. Check container status: `make status`
4. Review nginx logs: `docker exec pigeonhole-web cat /var/log/nginx/error.log`

---

**Docker deployment ready! 🐳**
