#!/bin/bash

echo "🔧 Instalando Generador de Prompts de Mantenimiento..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Generar Prisma Client
echo "🗄️  Generando cliente Prisma..."
npx prisma generate

# Crear base de datos
echo "💾 Creando base de datos..."
npm run db:push

# Poblar con datos
echo "🌱 Poblando base de datos..."
npm run db:seed

echo "✅ ¡Instalación completada!"
echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   npm run dev"
echo ""
echo "📋 Credenciales de demo:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
