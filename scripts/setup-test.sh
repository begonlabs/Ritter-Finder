#!/bin/bash

# Script de Configuración Rápida para Pruebas de Gestión de Usuarios
# RitterFinder

set -e

echo "🔧 Configuración Rápida para Pruebas de Gestión de Usuarios"
echo "============================================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio scripts/"
    exit 1
fi

print_info "Verificando configuración..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi

print_success "Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

print_success "npm encontrado: $(npm --version)"

# Cargar variables de entorno desde el directorio raíz
print_info "Cargando variables de entorno desde el directorio raíz..."

if [ -f "../.env.local" ]; then
    export $(grep -v '^#' ../.env.local | xargs)
    print_success "Variables cargadas desde .env.local"
elif [ -f "../.env" ]; then
    export $(grep -v '^#' ../.env | xargs)
    print_success "Variables cargadas desde .env"
else
    print_error "No se encontró archivo .env.local o .env en el directorio raíz"
    print_info "Asegúrate de tener un archivo .env.local o .env en el directorio raíz del proyecto"
    exit 1
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

print_success "Variables de entorno verificadas"

# Instalar dependencias
print_info "Instalando dependencias..."
npm install
print_success "Dependencias instaladas"

# Hacer ejecutable el script principal
chmod +x run-user-test.sh
print_success "Scripts configurados como ejecutables"

# Verificar conexión a Supabase
print_info "Verificando conexión a Supabase..."

# Crear script temporal para verificar conexión
cat > temp-connection-test.js << 'EOF'
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables de entorno faltantes')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function testConnection() {
    try {
        // Probar conexión listando usuarios
        const { data, error } = await supabase.auth.admin.listUsers()
        
        if (error) {
            throw new Error(error.message)
        }
        
        console.log('✅ Conexión a Supabase exitosa')
        console.log(`📊 Usuarios encontrados: ${data.users.length}`)
        
        // Probar acceso a tablas
        const { data: roles, error: rolesError } = await supabase
            .from('roles')
            .select('count')
            .limit(1)
        
        if (rolesError) {
            throw new Error(`Error accediendo a roles: ${rolesError.message}`)
        }
        
        console.log('✅ Acceso a tablas verificado')
        
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`)
        process.exit(1)
    }
}

testConnection()
EOF

# Ejecutar prueba de conexión
node temp-connection-test.js

# Limpiar archivo temporal
rm temp-connection-test.js

print_success "Configuración completada exitosamente!"
echo ""
print_info "Ahora puedes ejecutar las pruebas:"
echo "  ./run-user-test.sh"
echo ""
print_info "O ejecutar comandos específicos:"
echo "  ./run-user-test.sh test      # Prueba completa"
echo "  ./run-user-test.sh cleanup   # Limpiar usuarios de prueba"
echo "  ./run-user-test.sh verify    # Verificar usuario específico" 