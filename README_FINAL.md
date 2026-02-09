# 🚀 VERSIÓN DIRECTA - SIN USUARIOS - INSTALACIÓN DEFINITIVA

## ✨ CAMBIOS EN ESTA VERSIÓN

He **eliminado completamente la tabla de usuarios** de la base de datos.

Ahora:

- ✅ Sin tabla `User`
- ✅ Sin relaciones `userId`
- ✅ Sin autenticación
- ✅ **Acceso directo total**

-----

## 📦 INSTALACIÓN (Copiar y Pegar)

```bash
# 1. Descomprimir
tar -xzf maintenance-prompt-builder-DIRECTO.tar.gz
cd maintenance-prompt-builder

# 2. Instalar
npm install

# 3. Generar Prisma
npx prisma generate

# 4. Crear BD (IMPORTANTE: esto eliminará la BD anterior si existe)
npx prisma db push --force-reset

# 5. Poblar datos
npm run db:seed

# 6. Iniciar
npm run dev
```

**Abre**: http://localhost:3000

**¡Listo! Estás dentro del dashboard directamente**

-----

## 🎯 LO QUE CAMBIÓ

### 1. Schema de Base de Datos (`prisma/schema.prisma`)

```prisma
# ELIMINADO:
model User { ... }

# ACTUALIZADO:
model Project {
  # Sin userId
  # Sin relación user
}
```

### 2. Seed (`prisma/seed.ts`)

```typescript
// ELIMINADO:
// - Creación de usuario
// - Hash de contraseña
// - userId en proyectos

// AHORA:
- Solo templates
- Solo proyecto de ejemplo
```

### 3. Dashboard (`src/app/dashboard/page.tsx`)

```typescript
// ELIMINADO:
// - getSession()
// - Usuario hardcodeado
// - Filtro por userId

// AHORA:
- Obtiene todos los proyectos
- Sin filtros
```

### 4. APIs (`src/app/api/projects/*`)

```typescript
// ELIMINADO:
// - Verificación de sesión
// - getDemoUser()
// - Filtro por userId

// AHORA:
- CRUD directo
- Sin autenticación
```

-----

## ✅ ESTRUCTURA DE BD FINAL

```
PromptTemplate  → Templates de prompts
Project         → Proyectos (sin userId)
Installation    → Instalaciones por proyecto
InventoryItem   → Inventario por proyecto
PromptVersion   → Historial de prompts generados
```

-----

## 🎮 FLUJO DE USO

```
1. npm run dev
2. Abrir http://localhost:3000
3. ¡YA ESTÁS EN EL DASHBOARD!
4. Crear proyecto
5. Configurar instalaciones
6. Rellenar inventario
7. Generar prompt
8. Copiar y usar
```

-----

## 📊 DATOS DE EJEMPLO

Al ejecutar `npm run db:seed`:

✅ **7 Templates** de prompts  
✅ **1 Proyecto** de ejemplo:

- Nombre: Edificio Industrial - Alcobendas
- CCAA: Madrid
- 7 Instalaciones configuradas
- Inventario completo

-----

## 🔧 COMANDOS ÚTILES

```bash
# Ver base de datos
npm run db:studio

# Resetear BD
rm prisma/dev.db
npx prisma db push --force-reset
npm run db:seed

# Desarrollo
npm run dev

# Build producción
npm run build
npm start
```

-----

## ☁️ DESPLIEGUE (RENDER)

Este proyecto ya incluye `render.yaml` para desplegar con SQLite persistente.

### Pasos

1. Sube este proyecto a un repositorio GitHub.
2. En Render: `New +` -> `Blueprint`.
3. Selecciona tu repositorio.
4. Render leerá `render.yaml` y creará:
   - Servicio web Node.js
   - Disco persistente en `/var/data`
   - `DATABASE_URL=file:/var/data/dev.db`
5. Al arrancar, el comando `npm run start:render` ejecuta:
   - `npm run db:push` (sincroniza tablas)
   - `next start`

### Cargar datos demo en producción (opcional)

Después del primer deploy, abre `Shell` en Render y ejecuta:

```bash
npm run db:seed
```

Luego entra en:

`https://tu-app.onrender.com/dashboard`

-----

## ⚠️ SI TIENES LA VERSIÓN ANTERIOR INSTALADA

**IMPORTANTE**: Si ya instalaste alguna versión anterior, debes borrar la BD:

```bash
# Entrar al directorio
cd maintenance-prompt-builder

# Borrar BD anterior (tiene tabla User)
rm prisma/dev.db

# Crear nueva BD (sin tabla User)
npx prisma db push --force-reset

# Poblar
npm run db:seed

# Iniciar
npm run dev
```

-----

## 🐛 TROUBLESHOOTING

### Error: no carga `/dashboard` o aparece "Base de datos no inicializada"

**Solución:**

```bash
rm prisma/dev.db
npm run db:push -- --force-reset
npm run db:seed
```

### Error: The table `main.Project`/`main.PromptTemplate` does not exist

**Solución:**

```bash
npm run db:push -- --force-reset
npm run db:seed
```

### Puerto 3000 ocupado

```bash
npm run dev -- -p 3001
```

-----

## 📝 ARCHIVOS MODIFICADOS

```
prisma/schema.prisma           ✅ Sin model User
prisma/seed.ts                 ✅ Sin creación de usuario
src/app/dashboard/page.tsx     ✅ Sin getSession
src/app/api/projects/route.ts  ✅ Sin userId
src/app/api/projects/[id]/*    ✅ Sin filtros de usuario
```

-----

## ✨ VENTAJAS

1. **Más simple**: Menos código, menos errores
1. **Más rápido**: Sin verificaciones de auth
1. **Más directo**: Abrir y usar
1. **Perfecto para demo**: Ideal para probar
1. **Sin dependencias de bcrypt**: Una dependencia menos

-----

## 🎉 LISTO

**Esta es la versión más simple posible.**

Sin usuarios. Sin login. Sin complicaciones.

Solo:

1. Instala
1. Abre http://localhost:3000
1. Usa

¡Así de simple! 🚀
