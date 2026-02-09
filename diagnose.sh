#!/bin/bash

echo "🔍 DIAGNÓSTICO DE INSTALACIÓN"
echo "=============================="
echo ""

# Verificar Node.js
echo "✓ Verificando Node.js..."
node --version
echo ""

# Verificar npm
echo "✓ Verificando npm..."
npm --version
echo ""

# Verificar directorio
echo "✓ Verificando directorio actual..."
pwd
echo ""

# Verificar archivos principales
echo "✓ Verificando archivos principales..."
if [ -f "package.json" ]; then
    echo "  ✓ package.json existe"
else
    echo "  ✗ package.json NO EXISTE"
fi

if [ -f "prisma/schema.prisma" ]; then
    echo "  ✓ prisma/schema.prisma existe"
else
    echo "  ✗ prisma/schema.prisma NO EXISTE"
fi

if [ -f "src/app/page.tsx" ]; then
    echo "  ✓ src/app/page.tsx existe"
else
    echo "  ✗ src/app/page.tsx NO EXISTE"
fi
echo ""

# Verificar node_modules
echo "✓ Verificando node_modules..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules existe"
else
    echo "  ✗ node_modules NO EXISTE - ejecuta: npm install"
fi
echo ""

# Verificar store
echo "✓ Verificando store local..."
if [ -f "data/store.json" ]; then
    echo "  ✓ Store existe: data/store.json"
else
    echo "  ℹ Store todavía no existe (se crea automáticamente al usar la app)"
fi
echo ""

# Verificar proyectos en store (opcional)
echo "✓ Verificando proyectos en store..."
if [ -f "data/store.json" ]; then
    COUNT=$(node -e 'const fs=require("fs");const p="data/store.json";const d=JSON.parse(fs.readFileSync(p,"utf8"));console.log(Array.isArray(d.projects)?d.projects.length:0);' 2>/dev/null || echo "?")
    echo "  ✓ Proyectos en store: $COUNT"
else
    echo "  ℹ No hay proyectos todavía"
fi
echo ""

echo "=============================="
echo "RESULTADO:"
echo "=============================="

if [ -d "node_modules" ]; then
    echo "✅ INSTALACIÓN COMPLETA"
    echo ""
    echo "Puedes ejecutar:"
    echo "  npm run dev"
    echo ""
    echo "Luego abrir: http://localhost:3000/dashboard"
else
    echo "⚠️  INSTALACIÓN INCOMPLETA"
    echo ""
    echo "Ejecuta los siguientes comandos:"
    if [ ! -d "node_modules" ]; then
        echo "  1. npm install"
    fi
    echo "  2. npm run dev"
fi
echo ""
