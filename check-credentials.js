#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCredentials() {
  console.log('🔍 VERIFICANDO BASE DE DATOS');
  console.log('============================\n');

  try {
    const templates = await prisma.promptTemplate.count();
    const projects = await prisma.project.count();

    if (templates === 0) {
      console.log('❌ ERROR: No hay templates cargados');
      console.log('\nSolución:');
      console.log('  npm run db:seed');
      process.exit(1);
    }

    console.log('✅ Base de datos operativa');
    console.log(`   Templates: ${templates}`);
    console.log(`   Proyectos: ${projects}\n`);

    console.log('Dashboard listo en: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPosibles soluciones:');
    console.log('  npm run db:push');
    console.log('  npm run db:seed');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkCredentials();
