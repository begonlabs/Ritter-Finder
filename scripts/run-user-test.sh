#!/bin/bash

# Script de Prueba para Gestión de Usuarios - RitterFinder
# Este script instala dependencias y ejecuta las pruebas de gestión de usuarios

set -e

echo "🚀 RitterFinder - Script de Prueba para Gestión de Usuarios"
echo "=========================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio scripts/"
    exit 1
fi

# Cargar variables de entorno desde el directorio raíz del proyecto
print_info "Cargando variables de entorno desde el directorio raíz..."
if [ -f "../.env.local" ]; then
    export $(grep -v '^#' ../.env.local | xargs)
    print_status "Variables cargadas desde .env.local"
elif [ -f "../.env" ]; then
    export $(grep -v '^#' ../.env | xargs)
    print_status "Variables cargadas desde .env"
else
    print_warning "No se encontró archivo .env.local o .env en el directorio raíz"
fi

# Verificar variables de entorno
print_info "Verificando variables de entorno..."

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    print_error "NEXT_PUBLIC_SUPABASE_URL no está definida"
    print_info "Asegúrate de que el archivo .env.local o .env esté en el directorio raíz del proyecto"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    print_error "SUPABASE_SERVICE_ROLE_KEY no está definida"
    print_info "Asegúrate de que el archivo .env.local o .env esté en el directorio raíz del proyecto"
    exit 1
fi

print_status "Variables de entorno verificadas"

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    print_info "Instalando dependencias..."
    npm install
    print_status "Dependencias instaladas"
else
    print_info "Dependencias ya instaladas"
fi

# Función para mostrar menú
show_menu() {
    echo ""
    echo "📋 Menú de Pruebas:"
    echo "1. Ejecutar prueba completa (crear y eliminar usuario)"
    echo "2. Limpiar usuarios de prueba"
    echo "3. Verificar datos de usuario específico"
    echo "4. Salir"
    echo ""
    read -p "Selecciona una opción (1-4): " choice
}

# Función para ejecutar prueba completa
run_full_test() {
    print_info "Ejecutando prueba completa..."
    node test-user-management.js test
}

# Función para limpiar usuarios de prueba
cleanup_test_users() {
    print_info "Limpiando usuarios de prueba..."
    node test-user-management.js cleanup
}

# Función para verificar usuario específico
verify_specific_user() {
    read -p "Ingresa el ID del usuario a verificar: " user_id
    if [ -z "$user_id" ]; then
        print_error "Debes proporcionar un ID de usuario"
        return
    fi
    print_info "Verificando usuario: $user_id"
    node test-user-management.js verify "$user_id"
}

# Procesar argumentos de línea de comandos
if [ $# -eq 0 ]; then
    # Modo interactivo
    while true; do
        show_menu
        case $choice in
            1)
                run_full_test
                ;;
            2)
                cleanup_test_users
                ;;
            3)
                verify_specific_user
                ;;
            4)
                print_status "¡Hasta luego!"
                exit 0
                ;;
            *)
                print_error "Opción inválida"
                ;;
        esac
        
        echo ""
        read -p "Presiona Enter para continuar..."
    done
else
    # Modo no interactivo
    case $1 in
        "test")
            run_full_test
            ;;
        "cleanup")
            cleanup_test_users
            ;;
        "verify")
            if [ -z "$2" ]; then
                print_error "Debes proporcionar un ID de usuario para verificar"
                exit 1
            fi
            print_info "Verificando usuario: $2"
            node test-user-management.js verify "$2"
            ;;
        *)
            print_error "Uso: $0 [test|cleanup|verify <user_id>]"
            exit 1
            ;;
    esac
fi 