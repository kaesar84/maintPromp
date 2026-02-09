# Generador de Prompts de Mantenimiento

Aplicación web para generar prompts profesionales de planes de mantenimiento industrial según normativa española.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente Prisma y crear base de datos
npx prisma generate
npx prisma db push

# 3. Poblar base de datos con templates y datos de ejemplo
npm run db:seed

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📋 Credenciales de Demo

```
Email: demo@example.com
Password: demo123
```

## 🏗️ Estructura del Proyecto

```
maintenance-prompt-builder/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── login/             # Página de login
│   │   └── dashboard/         # Dashboard principal
│   ├── components/            # Componentes React
│   │   └── ui/                # Componentes UI
│   ├── lib/                   # Utilidades y lógica
│   │   ├── prompt-builder/    # Motor de generación
│   │   ├── auth.ts            # Autenticación
│   │   └── db.ts              # Cliente Prisma
│   └── types/                 # Tipos TypeScript
├── prisma/
│   ├── schema.prisma          # Esquema de BD
│   └── seed.ts                # Datos iniciales
└── package.json
```

## 📝 Uso

### 1. Crear Proyecto
- Ingresar información básica (nombre, ubicación, uso)
- Seleccionar objetivo del plan
- Definir nivel de criticidad

### 2. Seleccionar Instalaciones
- Marcar instalaciones presentes (PCI, BT, HVAC, etc.)

### 3. Completar Inventario
- Rellenar datos técnicos por instalación
- Campos marcados como "Desconocido" son permitidos

### 4. Generar Prompt
- Elegir modo de documento
  - Plan Integral
  - Plan por Instalación
  - Checklist Operativo
  - Matriz Legal
  - Calendario Anual
  - SOP Procedimiento
- Copiar prompt generado
- Exportar en formato TXT o MD

### 5. Usar en tu LLM favorito
- Pegar el prompt en Claude, GPT-4, etc.
- Obtener plan de mantenimiento profesional

## 🔧 Desarrollo

```bash
# Ver base de datos en Prisma Studio
npm run db:studio

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Formatear código
npm run lint
```

## 📦 Base de Datos

La aplicación usa SQLite en desarrollo (archivo `prisma/dev.db`).

Para producción, cambiar en `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```

Y actualizar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // cambiar de sqlite
  url      = env("DATABASE_URL")
}
```

## 🎯 Roadmap MVP

- [x] CRUD de proyectos
- [x] Selección de instalaciones
- [x] Formulario de inventario dinámico
- [x] Motor PromptBuilder
- [x] 6 modos de generación
- [x] Export TXT/MD
- [x] Historial de versiones
- [ ] Diff entre versiones
- [ ] Wizard paso a paso
- [ ] Duplicar proyectos
- [ ] Búsqueda avanzada

## 📄 Licencia

Propiedad privada - Todos los derechos reservados

## 🤝 Soporte

Para dudas o problemas, contactar al equipo de desarrollo.
