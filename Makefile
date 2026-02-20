# Makefile for PigeonHole Web UI

# Variables
APP_NAME = flightdeck
VERSION ?= latest
DOCKER_IMAGE = $(APP_NAME):$(VERSION)
DOCKER_REGISTRY ?= ghcr.io/pigeonhole
PORT ?= 3000
DOCKER_PORT ?= 8080

# Environment variables for build
AUTH0_CLIENT_ID ?= your_auth0_client_id_here
API_BASE_URL ?= https://api.pigeonhole.io/v1

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)PigeonHole Web UI - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

.PHONY: dev
dev: ## Run development server
	@echo "$(GREEN)Starting development server on http://localhost:$(PORT)...$(NC)"
	npm run dev

.PHONY: build
build: ## Build production bundle
	@echo "$(GREEN)Building production bundle...$(NC)"
	npm run build

.PHONY: preview
preview: ## Preview production build locally
	@echo "$(GREEN)Previewing production build...$(NC)"
	npm run preview

.PHONY: lint
lint: ## Run linter
	@echo "$(GREEN)Running linter...$(NC)"
	npm run lint || true

.PHONY: clean
clean: ## Clean build artifacts and dependencies
	@echo "$(RED)Cleaning build artifacts...$(NC)"
	rm -rf dist node_modules .vite

##@ Docker

.PHONY: docker-build
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image: $(DOCKER_IMAGE)...$(NC)"
	docker build \
		--build-arg VITE_AUTH0_CLIENT_ID=$(AUTH0_CLIENT_ID) \
		--build-arg VITE_API_BASE_URL=$(API_BASE_URL) \
		-t $(DOCKER_IMAGE) \
		.

.PHONY: docker-build-dev
docker-build-dev: ## Build Docker image with development settings
	@echo "$(GREEN)Building Docker image for development...$(NC)"
	docker build \
		--build-arg VITE_AUTH0_CLIENT_ID=$(AUTH0_CLIENT_ID) \
		--build-arg VITE_API_BASE_URL=http://localhost:8080/v1 \
		-t $(DOCKER_IMAGE)-dev \
		.

.PHONY: docker-run
docker-run: ## Run Docker container
	@echo "$(GREEN)Running Docker container on port $(DOCKER_PORT)...$(NC)"
	docker run -d \
		--name $(APP_NAME) \
		-p $(DOCKER_PORT):80 \
		--restart unless-stopped \
		$(DOCKER_IMAGE)
	@echo "$(GREEN)Container started! Access at http://localhost:$(DOCKER_PORT)$(NC)"

.PHONY: docker-run-fg
docker-run-fg: ## Run Docker container in foreground (for debugging)
	@echo "$(GREEN)Running Docker container in foreground on port $(DOCKER_PORT)...$(NC)"
	docker run --rm \
		--name $(APP_NAME) \
		-p $(DOCKER_PORT):80 \
		$(DOCKER_IMAGE)

.PHONY: docker-stop
docker-stop: ## Stop Docker container
	@echo "$(YELLOW)Stopping Docker container...$(NC)"
	docker stop $(APP_NAME) || true
	docker rm $(APP_NAME) || true

.PHONY: docker-logs
docker-logs: ## View Docker container logs
	@echo "$(GREEN)Viewing logs for $(APP_NAME)...$(NC)"
	docker logs -f $(APP_NAME)

.PHONY: docker-shell
docker-shell: ## Open shell in running container
	@echo "$(GREEN)Opening shell in container...$(NC)"
	docker exec -it $(APP_NAME) sh

.PHONY: docker-push
docker-push: ## Push Docker image to registry
	@echo "$(GREEN)Pushing Docker image to registry...$(NC)"
	docker tag $(DOCKER_IMAGE) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE)

.PHONY: docker-clean
docker-clean: ## Remove Docker image and stopped containers
	@echo "$(RED)Cleaning Docker resources...$(NC)"
	docker stop $(APP_NAME) || true
	docker rm $(APP_NAME) || true
	docker rmi $(DOCKER_IMAGE) || true

##@ Docker Compose

.PHONY: compose-up
compose-up: ## Start services with docker-compose
	@echo "$(GREEN)Starting services with docker-compose...$(NC)"
	docker-compose up -d

.PHONY: compose-down
compose-down: ## Stop services with docker-compose
	@echo "$(YELLOW)Stopping services with docker-compose...$(NC)"
	docker-compose down

.PHONY: compose-logs
compose-logs: ## View docker-compose logs
	@echo "$(GREEN)Viewing docker-compose logs...$(NC)"
	docker-compose logs -f

.PHONY: compose-restart
compose-restart: ## Restart docker-compose services
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker-compose restart

##@ Testing & Quality

.PHONY: test
test: ## Run tests (placeholder - add when tests are implemented)
	@echo "$(YELLOW)Tests not yet implemented$(NC)"

.PHONY: type-check
type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running TypeScript type check...$(NC)"
	npx tsc --noEmit

.PHONY: format
format: ## Format code with prettier (if configured)
	@echo "$(GREEN)Formatting code...$(NC)"
	npx prettier --write "src/**/*.{ts,tsx,css,json}" || echo "$(YELLOW)Prettier not configured$(NC)"

##@ Deployment

.PHONY: deploy-netlify
deploy-netlify: build ## Deploy to Netlify
	@echo "$(GREEN)Deploying to Netlify...$(NC)"
	npx netlify deploy --prod --dir=dist

.PHONY: deploy-vercel
deploy-vercel: build ## Deploy to Vercel
	@echo "$(GREEN)Deploying to Vercel...$(NC)"
	npx vercel --prod

.PHONY: deploy-preview
deploy-preview: build ## Deploy preview to Netlify
	@echo "$(GREEN)Deploying preview to Netlify...$(NC)"
	npx netlify deploy --dir=dist

##@ Utilities

.PHONY: env-setup
env-setup: ## Create .env.local from .env.example
	@echo "$(GREEN)Setting up environment file...$(NC)"
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "$(GREEN)Created .env.local - please edit with your values$(NC)"; \
	else \
		echo "$(YELLOW).env.local already exists$(NC)"; \
	fi

.PHONY: check-deps
check-deps: ## Check for outdated dependencies
	@echo "$(GREEN)Checking for outdated dependencies...$(NC)"
	npm outdated || true

.PHONY: update-deps
update-deps: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	npm update

.PHONY: audit
audit: ## Run security audit
	@echo "$(GREEN)Running security audit...$(NC)"
	npm audit

.PHONY: audit-fix
audit-fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities...$(NC)"
	npm audit fix

.PHONY: size
size: build ## Analyze bundle size
	@echo "$(GREEN)Analyzing bundle size...$(NC)"
	@du -sh dist/
	@echo ""
	@echo "$(GREEN)Asset breakdown:$(NC)"
	@ls -lh dist/assets/ | awk '{print $$9, $$5}'

##@ Quick Start

.PHONY: setup
setup: env-setup install ## Complete setup (env + install)
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development server$(NC)"

.PHONY: start
start: dev ## Alias for 'make dev'

.PHONY: run
run: docker-build docker-run ## Build and run Docker container

.PHONY: restart
restart: docker-stop docker-run ## Restart Docker container

##@ Information

.PHONY: info
info: ## Show project information
	@echo "$(GREEN)PigeonHole Web UI - Project Information$(NC)"
	@echo ""
	@echo "$(YELLOW)App Name:$(NC)        $(APP_NAME)"
	@echo "$(YELLOW)Version:$(NC)         $(VERSION)"
	@echo "$(YELLOW)Docker Image:$(NC)    $(DOCKER_IMAGE)"
	@echo "$(YELLOW)Dev Port:$(NC)        $(PORT)"
	@echo "$(YELLOW)Docker Port:$(NC)     $(DOCKER_PORT)"
	@echo "$(YELLOW)API Base URL:$(NC)    $(API_BASE_URL)"
	@echo ""
	@echo "$(GREEN)Node Version:$(NC)"
	@node --version || echo "Node.js not installed"
	@echo ""
	@echo "$(GREEN)npm Version:$(NC)"
	@npm --version || echo "npm not installed"
	@echo ""
	@echo "$(GREEN)Docker Version:$(NC)"
	@docker --version || echo "Docker not installed"

.PHONY: status
status: ## Show running containers and build status
	@echo "$(GREEN)Docker Containers:$(NC)"
	@docker ps -a --filter name=$(APP_NAME) || true
	@echo ""
	@echo "$(GREEN)Build Artifacts:$(NC)"
	@if [ -d dist ]; then \
		echo "✓ dist/ exists"; \
		du -sh dist/; \
	else \
		echo "✗ dist/ not found (run 'make build')"; \
	fi
	@echo ""
	@echo "$(GREEN)Node Modules:$(NC)"
	@if [ -d node_modules ]; then \
		echo "✓ node_modules/ exists"; \
	else \
		echo "✗ node_modules/ not found (run 'make install')"; \
	fi

# Default target
.DEFAULT_GOAL := help
