#!/bin/bash

# Quick Start Script for RitterFinder Docker Deployment
# This script helps set up everything for first-time deployment

set -e

echo "🌸 RitterFinder Quick Start Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root. Consider creating a dedicated user for deployment."
    fi
}

# Check Docker installation
check_docker() {
    print_info "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "Please install Docker first:"
        echo "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed!"
        echo "Please install Docker Compose first:"
        echo "sudo apt install -y docker-compose-plugin"
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed"
}

# Check other dependencies
check_dependencies() {
    print_info "Checking other dependencies..."
    
    local missing_deps=()
    
    for cmd in git make curl jq; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=($cmd)
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_warning "Missing dependencies: ${missing_deps[*]}"
        echo "Install them with:"
        echo "sudo apt install -y ${missing_deps[*]}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_status "All dependencies are installed"
    fi
}

# Setup environment files
setup_environment() {
    print_info "Setting up environment files..."
    
    if [[ ! -f .env.production ]]; then
        if [[ -f .env.production.example ]]; then
            cp .env.production.example .env.production
            print_status "Created .env.production from template"
            print_warning "Please edit .env.production with your actual values!"
            
            read -p "Open .env.production for editing now? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                ${EDITOR:-nano} .env.production
            fi
        else
            print_error ".env.production.example not found!"
            exit 1
        fi
    else
        print_status ".env.production already exists"
    fi
}

# Setup deployment scripts
setup_scripts() {
    print_info "Setting up deployment scripts..."
    
    if [[ -d "scripts" ]]; then
        chmod +x scripts/*.sh
        print_status "Made scripts executable"
        
        # Update PROJECT_DIR in scripts
        local current_dir=$(pwd)
        if grep -q "/path/to/your/ritterfinder" scripts/auto-deploy.sh; then
            sed -i "s|/path/to/your/ritterfinder|$current_dir|g" scripts/auto-deploy.sh
            print_status "Updated PROJECT_DIR in auto-deploy.sh"
        fi
        
        if grep -q "/path/to/your/ritterfinder" scripts/webhook-deploy.sh; then
            sed -i "s|/path/to/your/ritterfinder|$current_dir|g" scripts/webhook-deploy.sh
            print_status "Updated PROJECT_DIR in webhook-deploy.sh"
        fi
    else
        print_error "Scripts directory not found!"
        exit 1
    fi
}

# Test Docker setup
test_docker() {
    print_info "Testing Docker setup..."
    
    if docker info &> /dev/null; then
        print_status "Docker daemon is running"
    else
        print_error "Cannot connect to Docker daemon"
        echo "Try running: sudo systemctl start docker"
        exit 1
    fi
    
    # Test docker-compose
    if docker-compose version &> /dev/null || docker compose version &> /dev/null; then
        print_status "Docker Compose is working"
    else
        print_error "Docker Compose is not working properly"
        exit 1
    fi
}

# Build and test application
build_and_test() {
    print_info "Building Docker image (this may take a few minutes)..."
    
    if docker-compose build; then
        print_status "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
    
    print_info "Starting application for testing..."
    
    if docker-compose up -d; then
        print_status "Application started"
        
        # Wait for app to be ready
        print_info "Waiting for application to be ready..."
        for i in {1..30}; do
            if curl -f http://localhost:3000/api/health &> /dev/null; then
                print_status "Application is responding!"
                break
            else
                echo -n "."
                sleep 2
                if [[ $i -eq 30 ]]; then
                    print_error "Application failed to start properly"
                    echo "Check logs with: docker-compose logs"
                    exit 1
                fi
            fi
        done
    else
        print_error "Failed to start application"
        exit 1
    fi
}

# Show next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo "==============================="
    echo ""
    echo "Your RitterFinder application is now running at:"
    echo "🌐 Application: http://localhost:3000"
    echo "🏥 Health Check: http://localhost:3000/api/health"
    echo ""
    echo "📋 Next steps:"
    echo "1. Edit .env.production with your actual Supabase credentials"
    echo "2. Test the application in your browser"
    echo "3. Set up auto-deployment (see DEPLOYMENT.md)"
    echo "4. Configure domain and SSL (see DEPLOYMENT.md)"
    echo ""
    echo "🔧 Useful commands:"
    echo "make help          - See all available commands"
    echo "make logs          - View application logs"
    echo "make restart       - Restart the application"
    echo "make health        - Check application health"
    echo "make clean         - Clean up Docker resources"
    echo ""
    echo "📚 For detailed deployment instructions, see:"
    echo "cat DEPLOYMENT.md"
    echo ""
    print_status "Happy coding! 🌸✨"
}

# Main execution
main() {
    check_permissions
    check_docker
    check_dependencies
    setup_environment
    setup_scripts
    test_docker
    build_and_test
    show_next_steps
}

# Run if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 