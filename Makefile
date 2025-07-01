# Makefile for RitterFinder Docker Management
# Run 'make help' to see available commands

.PHONY: help build dev prod up down restart logs clean install deploy health

# Default target
help: ## Show this help message
	@echo "🌸 RitterFinder Docker Commands"
	@echo "==============================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
build: ## Build Docker images
	@echo "🔨 Building Docker images..."
	docker-compose build

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker-compose -f docker-compose.yml up --build

dev-bg: ## Start development environment in background
	@echo "🚀 Starting development environment in background..."
	docker-compose -f docker-compose.yml up -d --build

# Production commands
prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d --build

prod-logs: ## Show production logs
	@echo "📋 Showing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f

# Container management
up: ## Start containers
	@echo "⬆️  Starting containers..."
	docker-compose up -d

down: ## Stop and remove containers
	@echo "⬇️  Stopping containers..."
	docker-compose down

restart: ## Restart containers
	@echo "🔄 Restarting containers..."
	docker-compose restart

stop: ## Stop containers without removing them
	@echo "🛑 Stopping containers..."
	docker-compose stop

# Monitoring and debugging
logs: ## Show container logs
	@echo "📋 Showing logs..."
	docker-compose logs -f

logs-app: ## Show only app container logs
	@echo "📋 Showing app logs..."
	docker logs ritterfinder_app -f

health: ## Check container health
	@echo "🏥 Checking container health..."
	docker-compose ps
	@echo ""
	@echo "🌐 Testing application response..."
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Application is responding" || echo "❌ Application is not responding"

shell: ## Access container shell
	@echo "🐚 Accessing container shell..."
	docker exec -it ritterfinder_app /bin/sh

# Cleanup commands
clean: ## Remove all containers, images, and volumes
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down -v --rmi all
	docker system prune -f

clean-images: ## Remove unused Docker images
	@echo "🧹 Cleaning up unused images..."
	docker image prune -f

clean-volumes: ## Remove unused Docker volumes
	@echo "🧹 Cleaning up unused volumes..."
	docker volume prune -f

# Deployment commands
deploy: ## Run deployment script
	@echo "🚀 Running deployment script..."
	@chmod +x scripts/auto-deploy.sh
	@./scripts/auto-deploy.sh

deploy-webhook: ## Setup webhook deployment
	@echo "🎣 Setting up webhook deployment..."
	@chmod +x scripts/webhook-deploy.sh
	@echo "Webhook script is ready at scripts/webhook-deploy.sh"

# Utility commands
install: ## Install/update dependencies (if mounting node_modules)
	@echo "📦 Installing dependencies in container..."
	docker-compose exec ritterfinder pnpm install

update: ## Pull latest changes and redeploy
	@echo "📥 Pulling latest changes..."
	git pull origin main
	@echo "🔄 Redeploying application..."
	$(MAKE) deploy

backup: ## Backup important files
	@echo "💾 Creating backup..."
	@mkdir -p backups
	@tar -czf backups/ritterfinder-backup-$(shell date +%Y%m%d-%H%M%S).tar.gz \
		--exclude=node_modules \
		--exclude=.next \
		--exclude=.git \
		.
	@echo "✅ Backup created in backups/ directory"

# Environment setup
setup-prod: ## Setup production environment
	@echo "⚙️  Setting up production environment..."
	@cp .env.production.example .env.production
	@echo "📝 Please edit .env.production with your production values"
	@echo "🔧 Make scripts executable..."
	@chmod +x scripts/*.sh

# Monitoring
status: ## Show detailed status
	@echo "📊 RitterFinder Status"
	@echo "====================="
	@echo "🐳 Docker Containers:"
	@docker-compose ps
	@echo ""
	@echo "💾 Docker Images:"
	@docker images | grep ritterfinder || echo "No RitterFinder images found"
	@echo ""
	@echo "🌐 Network Status:"
	@docker network ls | grep ritterfinder || echo "No RitterFinder networks found" 