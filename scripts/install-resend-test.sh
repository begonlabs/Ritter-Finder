 #!/bin/bash

# Script para instalar dependencias y probar Resend SMTP
# RitterFinder Resend SMTP Test

echo "📧 RitterFinder - Test SMTP Resend"
echo "==================================="
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "test-resend-smtp.js" ]; then
    echo "❌ Error: No se encontró el archivo test-resend-smtp.js"
    echo "   Asegúrate de estar en el directorio scripts/"
    exit 1
fi

# Verificar si node está instalado (incluyendo nvm)
if ! command -v node &> /dev/null; then
    # Intentar cargar nvm si existe
    if [ -f "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Error: Node.js no está instalado"
        echo "   Instala Node.js desde https://nodejs.org/"
        exit 1
    fi
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Error: Node.js versión 14 o superior requerida"
    echo "   Versión actual: $(node --version)"
    echo "   Actualiza Node.js desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    echo "   Instala npm junto con Node.js"
    exit 1
fi

echo "🔧 Instalando dependencias..."
echo "   - nodemailer (para SMTP)"
echo ""

# Crear package.json si no existe
if [ ! -f "package.json" ]; then
    echo "📝 Creando package.json..."
    cat > package.json << EOF
{
  "name": "ritterfinder-resend-test",
  "version": "1.0.0",
  "description": "Test SMTP Resend para RitterFinder",
  "main": "test-resend-smtp.js",
  "scripts": {
    "test": "node test-resend-smtp.js"
  },
  "dependencies": {
    "nodemailer": "^6.9.0"
  }
}
EOF
fi

# Instalar dependencias
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""
echo "✅ Dependencias instaladas correctamente"
echo ""

# Mostrar información de configuración
echo "📋 Configuración SMTP Resend:"
echo "   - Host: smtp.resend.com"
echo "   - Puerto: 465"
echo "   - Usuario: resend"
echo "   - Contraseña: re_8JmekCyx_8YsPqb2aGbTBcS8nwYbhxenn"
echo ""

# Preguntar si ejecutar la prueba
echo "🚀 ¿Quieres ejecutar la prueba de SMTP ahora?"
echo "   Esta acción enviará emails de prueba a:"
echo "   - itsjhonalex@gmail.com"
echo "   - eberburn@gmail.com"
echo "   - rodrj0184@gmail.com"
echo ""
echo "   Presiona Ctrl+C para cancelar o Enter para continuar..."
read -r

echo ""
echo "🧪 Ejecutando prueba de SMTP Resend..."
echo ""

# Ejecutar el script
node test-resend-smtp.js

echo ""
echo "✅ Script completado"
echo "📧 Revisa las bandejas de entrada de los destinatarios"