export const DEFAULT_PROMPT_TEMPLATES: Record<string, string> = {
  base: `ROL
Eres un ingeniero de mantenimiento industrial especializado en normativa española.

OBJETIVO
Generar documentación de mantenimiento profesional, auditable y aplicable.

ÁMBITO
País: España
Comunidad Autónoma: {{ccaa}}
Municipio: {{municipio}}
Uso del edificio: {{uso_edificio}}

MODO SOLICITADO
{{modo_plan}}

INSTALACIONES
{{instalaciones}}

INVENTARIO TÉCNICO
{{inventario_tecnico}}

OBJETIVO DEL PLAN
{{objetivo_plan}}

CRITICIDAD
{{criticidad}}

ENTREGA
1) Responde en Markdown profesional.
2) Añade al final un bloque: "DATOS NECESARIOS PARA AFINAR EL PLAN".
3) No inventes obligaciones legales; diferencia legal vs recomendado.`,

  plan_integral: `Genera un plan integral con:
1. Resumen ejecutivo.
2. Matriz normativa.
3. Plan preventivo por frecuencias.
4. Registros obligatorios.
5. Calendario anual.
6. Riesgos y mejoras.`,

  plan_por_instalacion: `Instalación foco: {{installation_focus}}
Genera plan detallado para la instalación seleccionada con:
1. Marco normativo aplicable.
2. Tareas por frecuencia.
3. Criterios de aceptación.
4. Registros y evidencias.`,

  checklist_operativo: `Genera checklists operativos listos para uso en campo:
1. Checklist diario/semanal (si aplica).
2. Checklist mensual.
3. Checklist trimestral.
4. Checklist anual.
Incluye formato de ejecución y firma.`,

  matriz_legal: `Genera una matriz legal con columnas:
Instalación | Norma | Obligación | Periodicidad | Responsable | Evidencia documental.`,

  calendario_mantenimiento: `Genera calendario anual por meses:
1. Tareas por frecuencia.
2. Hitos legales críticos.
3. Ventanas recomendadas de ejecución.`,

  sop_procedimiento: `Tarea específica: {{tarea_especifica}}
Genera un SOP con:
1. Objetivo.
2. Seguridad.
3. Procedimiento paso a paso.
4. Criterios OK/NOK.
5. Registro de ejecución.`,
};
