# PigeonHole Web UI - Quick Start Guide

Get up and running in 5 minutes.

## Prerequisites

Choose one:
- **Local Development**: Node.js 18+ and npm
- **Docker**: Docker and Docker Compose

## Option 1: Local Development (Fastest)

```bash
# 1. Setup environment
make setup

# 2. Edit .env.local with your Auth0 Client ID
nano .env.local

# 3. Start development server
make dev

# Access at http://localhost:3000
```

## Option 2: Docker (Production-like)

```bash
# 1. Set environment variables
export AUTH0_CLIENT_ID=your_auth0_client_id
export API_BASE_URL=https://api.pigeonhole.io/v1

# 2. Build and run
make run

# Access at http://localhost:8080
```

## Option 3: Docker Compose

```bash
# 1. Create .env file
cat > .env << EOF
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_API_BASE_URL=https://api.pigeonhole.io/v1
PORT=8080
EOF

# 2. Start services
docker-compose up -d

# Access at http://localhost:8080
```

## Common Commands

### Development

```bash
make dev              # Start dev server (port 3000)
make build            # Build for production
make preview          # Preview production build
```

### Docker

```bash
make docker-build     # Build Docker image
make docker-run       # Run container (port 8080)
make docker-logs      # View logs
make docker-stop      # Stop container
```

### Quick Actions

```bash
make help             # Show all commands
make info             # Project information
make status           # Check status
make clean            # Clean build artifacts
```

## Auth0 Configuration

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a Single Page Application
3. Configure URLs:
   - Callback: `http://localhost:3000` or `http://localhost:8080`
   - Logout: `http://localhost:3000` or `http://localhost:8080`
   - Web Origins: `http://localhost:3000` or `http://localhost:8080`
4. Copy Client ID to `.env.local`

## Troubleshooting

### "Token exchange failed"
- Check Auth0 Client ID in `.env.local`
- Verify callback URLs in Auth0 dashboard

### "Cannot connect to Docker daemon"
- Start Docker Desktop
- Or use local development instead: `make dev`

### Port already in use
```bash
# Use different port
make dev PORT=3001
# Or for Docker
make docker-run DOCKER_PORT=8081
```

### Clean start
```bash
make clean
make setup
make dev
```

## Next Steps

1. **Read Documentation**:
   - [README.md](README.md) - Full documentation
   - [DOCKER.md](DOCKER.md) - Docker guide
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

2. **Test Features**:
   - Sign in with Auth0
   - Generate encryption keys
   - Upload and encrypt files
   - Send to recipients
   - Download and decrypt

3. **Deploy**:
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Support

- Check `make help` for all commands
- View logs: `make docker-logs`
- Check status: `make status`

---

**Ready to go! 🚀**
