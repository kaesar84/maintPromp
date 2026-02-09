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

# Verificar base de datos
echo "✓ Verificando base de datos..."
if [ -f "prisma/dev.db" ]; then
    echo "  ✓ Base de datos existe"
    echo "  → Verificando tablas principales..."
    sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Project;" >/dev/null 2>&1 && echo "  ✓ Tabla Project OK" || echo "  ⚠ No se pudo validar tabla Project (SQLite3 no instalado o esquema incompleto)"
else
    echo "  ✗ Base de datos NO EXISTE - ejecuta: npm run db:push && npm run db:seed"
fi
echo ""

# Verificar templates
echo "✓ Verificando templates de prompts..."
if [ -f "prisma/dev.db" ]; then
    COUNT=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM PromptTemplate;" 2>/dev/null || echo "?")
    if [ "$COUNT" = "7" ]; then
        echo "  ✓ 7 templates encontrados"
    else
        echo "  ⚠ Templates: $COUNT (deberían ser 7)"
    fi
else
    echo "  ⚠ No se puede verificar (DB no existe)"
fi
echo ""

echo "=============================="
echo "RESULTADO:"
echo "=============================="

if [ -d "node_modules" ] && [ -f "prisma/dev.db" ]; then
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
    echo "  2. npx prisma generate"
    echo "  3. npm run db:push"
    echo "  4. npm run db:seed"
    echo "  5. npm run dev"
fi
echo ""
