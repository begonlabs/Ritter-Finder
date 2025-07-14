#!/bin/bash

# Script para probar Resend SMTP con dominio por defecto
# RitterFinder - Test Resend Default Domain

echo "🚀 RitterFinder - Prueba Resend SMTP con Dominio por Defecto"
echo "=============================================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    echo "   Instala npm junto con Node.js"
    exit 1
fi

echo "✅ Node.js y npm detectados"
echo ""

# Verificar si el directorio scripts existe
if [ ! -d "scripts" ]; then
    echo "❌ Error: Directorio 'scripts' no encontrado"
    echo "   Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Cambiar al directorio scripts
cd scripts

# Verificar si el archivo de prueba existe
if [ ! -f "test-resend-smtp.js" ]; then
    echo "❌ Error: Archivo test-resend-smtp.js no encontrado"
    echo "   Verifica que el archivo existe en el directorio scripts"
    exit 1
fi

echo "📋 Verificando dependencias..."
echo ""

# Verificar si nodemailer está instalado
if [ ! -d "node_modules" ] || [ ! -f "node_modules/nodemailer/package.json" ]; then
    echo "📦 Instalando dependencias..."
    npm install nodemailer
    echo ""
fi

echo "✅ Dependencias verificadas"
echo ""

# Mostrar instrucciones
echo "📝 INSTRUCCIONES IMPORTANTES:"
echo "   1. Abre el archivo scripts/test-resend-smtp.js"
echo "   2. Reemplaza 're_1234567890abcdef' con tu API key real de Resend"
echo "   3. Guarda el archivo"
echo "   4. Presiona Enter para continuar..."
echo ""

read -p "¿Continuar? (Enter): "

echo ""
echo "🧪 Ejecutando prueba de Resend SMTP..."
echo ""

# Ejecutar la prueba
node test-resend-smtp.js

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Prueba completada exitosamente"
    echo ""
    echo "💡 Próximos pasos:"
    echo "   1. Revisa tu bandeja de entrada"
    echo "   2. Verifica la carpeta de spam"
    echo "   3. Si recibiste los emails, la configuración funciona"
    echo "   4. Configura tu dominio personalizado en Resend"
else
    echo ""
    echo "❌ La prueba falló"
    echo ""
    echo "🔧 Posibles soluciones:"
    echo "   1. Verifica tu API key de Resend"
    echo "   2. Asegúrate de que la API key sea válida"
    echo "   3. Revisa tu conexión a internet"
    echo "   4. Verifica los límites de tu cuenta de Resend"
fi

echo ""
echo "🌍 RitterFinder - Especialistas en Energías Renovables" 