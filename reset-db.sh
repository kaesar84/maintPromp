#!/bin/bash

echo "🔄 RESETEO COMPLETO DE BASE DE DATOS"
echo "====================================="
echo ""
echo "⚠️  ADVERTENCIA: Esto borrará TODOS los datos existentes."
echo ""
read -p "¿Continuar? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operación cancelada."
    exit 0
fi

echo ""
echo "1️⃣  Borrando base de datos existente..."
rm -f prisma/dev.db prisma/dev.db-journal
echo "   ✓ Base de datos eliminada"
echo ""

echo "2️⃣  Generando Prisma Client..."
npx prisma generate
echo "   ✓ Prisma Client generado"
echo ""

echo "3️⃣  Creando nueva base de datos..."
npx prisma db push --force-reset
echo "   ✓ Base de datos creada"
echo ""

echo "4️⃣  Poblando con datos de ejemplo..."
npm run db:seed
echo "   ✓ Datos insertados"
echo ""

echo "====================================="
echo "✅ RESETEO COMPLETO EXITOSO"
echo "====================================="
echo ""
echo "Credenciales de acceso:"
echo "  Email: demo@example.com"
echo "  Password: demo123"
echo ""
echo "Inicia el servidor con:"
echo "  npm run dev"
echo ""
