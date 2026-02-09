#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function checkCredentials() {
  console.log('🔍 VERIFICANDO STORE LOCAL');
  console.log('============================\n');

  try {
    const storePath = path.join(process.cwd(), 'data', 'store.json');
    const exists = fs.existsSync(storePath);

    if (!exists) {
      console.log('ℹ️  Store no creado todavía (se genera automáticamente en el primer uso)');
      console.log(`   Ruta esperada: ${storePath}`);
      console.log('\nDashboard listo en: http://localhost:3000/dashboard');
      return;
    }

    const raw = fs.readFileSync(storePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const projects = Array.isArray(parsed.projects) ? parsed.projects.length : 0;

    console.log('✅ Store operativo');
    console.log(`   Proyectos: ${projects}`);
    console.log(`   Archivo: ${storePath}\n`);

    console.log('Dashboard listo en: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPosibles soluciones:');
    console.log('  1) Ejecuta una vez la app y vuelve a comprobar');
    console.log('  2) Borra data/store.json si está corrupto');
    process.exit(1);
  }
}

checkCredentials();
