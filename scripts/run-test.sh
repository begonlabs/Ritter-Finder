#!/bin/bash

# Script para ejecutar la prueba de campaña de Mailjet
# RitterFinder Campaign Test Script

echo "📧 RitterFinder - Test de Campaña Mailjet"
echo "=========================================="
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "test-mailjet-campaign.js" ]; then
    echo "❌ Error: No se encontró el archivo test-mailjet-campaign.js"
    echo "   Asegúrate de estar en el directorio scripts/"
    exit 1
fi

# Verificar si node está instalado
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

echo "🔧 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""
echo "✅ Dependencias instaladas correctamente"
echo ""

# Preguntar confirmación
echo "⚠️  ¿Estás seguro de que quieres enviar la campaña de prueba?"
echo "   Esta acción enviará emails a:"
echo "   - itsjhonalex@gmail.com"
echo "   - eberburn@gmail.com" 
echo "   - rodrj0184@gmail.com"
echo ""
echo "   Presiona Ctrl+C para cancelar o Enter para continuar..."
read -r

echo ""
echo "🚀 Ejecutando prueba de campaña..."
echo ""

# Ejecutar el script
node test-mailjet-campaign.js

echo ""
echo "✅ Script completado"
echo "📧 Revisa las bandejas de entrada de los destinatarios" 