# 🚀 maintenance-prompt-builder (sin base de datos)

Versión simplificada del proyecto:

- ✅ Sin dependencia de SQLite/Prisma en runtime
- ✅ Sin tablas ni migraciones para usar la app
- ✅ Datos guardados en archivo local JSON (`data/store.json`)
- ✅ Lista para desplegar en Render Free

---

## 📦 Instalación local

```bash
npm install
npm run dev
```

Abrir: `http://localhost:3000/dashboard`

---

## 🧠 Cómo funciona ahora

El backend usa un store local en archivo:

- Ruta: `data/store.json`
- Se crea automáticamente al primer uso
- Guarda:
  - proyectos
  - instalaciones
  - inventario
  - historial de prompts

No necesitas ejecutar:

- `npm run db:push`
- `npm run db:seed`

---

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm start

# Verificación rápida del store
npm run check
```

---

## ☁️ Despliegue en Render Free

El repo ya incluye `render.yaml`.

### Pasos

1. Sube el código a GitHub.
2. En Render: `New +` -> `Blueprint`.
3. Selecciona el repo.
4. Render usará:
   - Build: `npm ci --include=dev && npm run build`
   - Start: `npm start`
5. Abre `https://<tu-app>.onrender.com/dashboard`

### Importante (plan Free)

- El filesystem no es persistente entre reinicios.
- Si el servicio se reinicia, el archivo `data/store.json` puede perderse.
- Si necesitas persistencia real, usa:
  - Render con disk (plan de pago), o
  - PostgreSQL (Neon/Supabase/Render Postgres).

---

## 🐛 Troubleshooting

### No se crea proyecto

1. Revisa logs del servicio.
2. Confirma que el backend está arriba (`/dashboard` responde).
3. Reinicia el servicio en Render.

### Quiero resetear todo en local

```bash
rm -f data/store.json
npm run dev
```

---

## 📁 Archivos clave

- `src/lib/store.ts` -> almacenamiento local JSON
- `src/app/api/projects/*` -> API sin Prisma
- `src/app/dashboard/page.tsx` -> dashboard sin consulta a BD
- `render.yaml` -> despliegue Render
