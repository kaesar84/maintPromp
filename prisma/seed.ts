import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROMPT_TEMPLATES = {
  base: `ROL
Eres un INGENIERO DE MANTENIMIENTO INDUSTRIAL y CONSULTOR TÉCNICO-LEGAL,
especialista en instalaciones técnicas de edificios e industria en ESPAÑA,
con conocimiento actualizado de normativa española y europea (UE).

OBJETIVO
Generar documentación de mantenimiento PROFESIONAL, AUDITABLE y APLICABLE,
alineada con la normativa VIGENTE en España y la Unión Europea,
en función de los datos y alcance indicados a continuación.

============================================================
REGLAS OBLIGATORIAS (NO OMITIR)
============================================================

1. NO inventes normativa, artículos ni periodicidades.
2. Diferencia SIEMPRE:
   (a) mantenimiento LEGAL obligatorio,
   (b) mantenimiento PREVENTIVO recomendado,
   (c) mejoras técnicas / predictivo (opcional).
3. Para cada obligación legal indica explícitamente:
   - Norma (RD / ITC / UNE / UNE-EN / Reglamento UE)
   - Referencia concreta si aplica
   - Periodicidad mínima exigida
   - Responsable:
     · Titular / Usuario
     · Empresa mantenedora habilitada
     · OCA u organismo de control
   - Registro o evidencia documental exigida
4. Si existe posible normativa autonómica o municipal:
   - Indícalo claramente
   - Recomienda validación local
5. Si faltan datos técnicos:
   - Declara SUPUESTOS razonables
   - Continúa el plan
   - Lista los datos necesarios al final
6. Lenguaje técnico profesional, claro y sin relleno.

============================================================
ÁMBITO GEOGRÁFICO Y USO
============================================================

País: España  
Comunidad Autónoma: {{ccaa}}  
Municipio (si aplica): {{municipio}}  
Uso del edificio/instalación: {{uso_edificio}}

============================================================
TIPO DE DOCUMENTO A GENERAR
============================================================

Modo de salida seleccionado: {{modo_plan}}

============================================================
INSTALACIONES INCLUIDAS
============================================================

Instalaciones a considerar:
{{instalaciones}}

============================================================
INVENTARIO Y DATOS TÉCNICOS
============================================================

{{inventario_tecnico}}

============================================================
OBJETIVO DEL PLAN
============================================================

Objetivo principal: {{objetivo_plan}}

Nivel de criticidad de las instalaciones: {{criticidad}}

============================================================
FORMATO DE ENTREGA
============================================================

Devuelve:
1) El contenido en MARKDOWN, listo para uso profesional.
2) Un BLOQUE FINAL titulado exactamente:

   "DATOS NECESARIOS PARA AFINAR EL PLAN"

con entre 5 y 10 preguntas TÉCNICAS y CONCRETAS,
adaptadas a las instalaciones incluidas.

NO incluyas explicaciones sobre cómo has generado el contenido.
NO hagas referencias a modelos de lenguaje o a este prompt.`,

  plan_integral: `============================================================
INSTRUCCIONES ESPECÍFICAS - PLAN INTEGRAL
============================================================

Genera un PLAN INTEGRAL DE MANTENIMIENTO que incluya:

1. RESUMEN EJECUTIVO
   - Alcance del plan
   - Instalaciones cubiertas
   - Objetivos principales
   - Responsabilidades clave

2. INVENTARIO TÉCNICO
   - Listado completo por instalación
   - Datos técnicos disponibles
   - Elementos críticos identificados

3. MATRIZ NORMATIVA LEGAL
   - Tabla con: Instalación | Normativa aplicable | Periodicidad | Responsable | Registro
   - Diferenciando obligaciones legales de recomendaciones

4. PLAN DE MANTENIMIENTO PREVENTIVO
   - Por cada instalación:
     * Tareas diarias/semanales/mensuales/trimestrales/anuales
     * Descripción de cada tarea
     * Responsable (interno/externo/OCA)
     * Evidencia documental generada

5. PLANES ESPECÍFICOS (cuando aplique)
   - Plan específico de Legionella (si aplica)
   - Plan de Calidad del Aire Interior (si aplica)
   - Otros según instalaciones

6. GESTIÓN DEL MANTENIMIENTO CORRECTIVO
   - Clasificación de averías por criticidad
   - Tiempos de respuesta recomendados
   - Protocolo de gestión

7. REGISTROS Y DOCUMENTACIÓN OBLIGATORIA
   - Libro de mantenimiento (formato y contenido)
   - Certificados exigibles
   - Conservación documental

8. CALENDARIO DE ACTUACIONES
   - Vista mensual del año
   - Destacar hitos críticos y vencimientos legales

9. KPIs DE MANTENIMIENTO
   - Indicadores clave según objetivo y criticidad
   - Objetivos recomendados

10. RIESGOS HABITUALES Y MEJORAS RECOMENDADAS
    - Riesgos típicos por instalación
    - Recomendaciones de mejora técnica
    - Priorización según criticidad`,

  plan_por_instalacion: `============================================================
INSTRUCCIONES ESPECÍFICAS - PLAN POR INSTALACIÓN
============================================================

Instalación específica a desarrollar: {{installation_focus}}

Genera un PLAN DE MANTENIMIENTO DETALLADO para esta instalación que incluya:

1. DESCRIPCIÓN DE LA INSTALACIÓN
   - Características técnicas (basado en inventario)
   - Componentes principales
   - Puntos críticos

2. MARCO NORMATIVO ESPECÍFICO
   - Reglamentos y normas aplicables
   - Obligaciones legales concretas
   - Periodicidades mínimas
   - Organismos competentes

3. PROGRAMA DE MANTENIMIENTO PREVENTIVO
   - Tareas por frecuencia (diaria, semanal, mensual, trimestral, semestral, anual)
   - Descripción detallada de cada tarea
   - Checklist específico por tarea
   - Criterios de aceptación/rechazo
   - Responsable de ejecución
   - Tiempo estimado por tarea

4. MANTENIMIENTO CORRECTIVO
   - Averías más frecuentes
   - Diagnóstico y soluciones
   - Repuestos críticos recomendados

5. INSPECCIONES REGLAMENTARIAS
   - Inspecciones por OCA (si aplica)
   - Inspecciones propias obligatorias
   - Documentación generada

6. REGISTROS Y EVIDENCIAS
   - Libro de mantenimiento específico
   - Formatos de registro recomendados
   - Conservación documental

7. RIESGOS Y MEDIDAS PREVENTIVAS
   - Riesgos operacionales
   - Medidas de seguridad
   - EPI necesarios

8. INDICADORES DE DESEMPEÑO
   - KPIs específicos de la instalación
   - Objetivos recomendados

9. MEJORAS Y OPTIMIZACIÓN
   - Propuestas de mejora técnica
   - Modernización recomendada
   - Análisis coste-beneficio orientativo`,

  checklist_operativo: `============================================================
INSTRUCCIONES ESPECÍFICAS - CHECKLIST OPERATIVO
============================================================

Genera CHECKLISTS OPERATIVOS listos para imprimir y usar, organizados por:

1. CHECKLISTS DIARIOS/SEMANALES (si aplican)
   - Por instalación
   - Formato: ☐ Tarea | Criterio OK/NOK | Observaciones | Firma

2. CHECKLISTS MENSUALES
   - Por instalación
   - Incluir puntos de inspección visual
   - Parámetros a medir/verificar

3. CHECKLISTS TRIMESTRALES
   - Tareas trimestrales agrupadas
   - Formato ejecutivo

4. CHECKLISTS SEMESTRALES

5. CHECKLISTS ANUALES
   - Incluir preparación para inspecciones reglamentarias

Para cada checklist:
- Título claro
- Frecuencia
- Instalación
- Fecha de aplicación: ___/___/___
- Técnico responsable: _______________
- Lista de verificación (checkboxes)
- Espacio para observaciones
- Firma y fecha de cierre

IMPORTANTE:
- Formato limpio y profesional
- Listo para imprimir en A4
- Sin elementos decorativos, solo funcional
- Criterios objetivos de aceptación`,

  matriz_legal: `============================================================
INSTRUCCIONES ESPECÍFICAS - MATRIZ LEGAL
============================================================

Genera una MATRIZ LEGAL DE OBLIGACIONES en formato tabla que incluya:

COLUMNAS:
1. Instalación
2. Normativa aplicable (RD, ITC, UNE-EN, Reglamento UE)
3. Artículo/apartado concreto
4. Obligación específica
5. Periodicidad mínima legal
6. Responsable (Titular/Empresa habilitada/OCA)
7. Registro/Evidencia exigida
8. Sanción por incumplimiento (orientativo)
9. Próximo vencimiento (calcular desde hoy)
10. Observaciones

SECCIONES:
1. Matriz principal (todas las instalaciones)
2. Calendario de vencimientos legales (12 meses vista)
3. Leyenda de responsables
4. Notas sobre normativa autonómica/municipal aplicable
5. Referencias normativas completas

CRITERIOS:
- Solo obligaciones LEGALES (no recomendaciones)
- Referencias exactas (no inventar)
- Periodicidades según norma
- Indicar si existe excepciones o condiciones
- Destacar obligaciones críticas

FORMATO:
- Tabla clara y ordenada
- Agrupación por instalación
- Subrayar elementos de alta criticidad legal
- Notas al pie cuando sea necesario aclarar`,

  calendario_mantenimiento: `============================================================
INSTRUCCIONES ESPECÍFICAS - CALENDARIO ANUAL
============================================================

Genera un CALENDARIO ANUAL DE MANTENIMIENTO que incluya:

1. VISTA MENSUAL (12 meses desde hoy)
   Para cada mes mostrar:
   - Semana 1, 2, 3, 4
   - Tareas preventivas programadas
   - Inspecciones reglamentarias
   - Vencimientos legales
   - Hitos críticos

2. LEYENDA DE COLORES/SÍMBOLOS
   - 🔴 Crítico/Legal/OCA
   - 🟡 Preventivo importante
   - 🟢 Preventivo rutinario
   - ⚙️ Mantenimiento correctivo estimado

3. AGRUPACIÓN POR RESPONSABLE
   - Tareas internas (personal propio)
   - Tareas externas (mantenedora)
   - Inspecciones OCA

4. TABLA DE PLANIFICACIÓN
   Columnas:
   - Mes
   - Semana
   - Instalación
   - Tarea
   - Tipo (Legal/Preventivo)
   - Responsable
   - Duración estimada
   - Estado (Pendiente/Realizado)

5. RECURSOS NECESARIOS
   - Personal por mes
   - Horas estimadas totales
   - Paradas necesarias (si aplica)

6. NOTAS:
   - Fechas flexibles vs. fechas imperativas
   - Coordinación entre tareas
   - Ventanas de mantenimiento recomendadas

OBJETIVO:
Herramienta ejecutiva para planificar el año completo de mantenimiento,
con énfasis en no perder vencimientos legales.`,

  sop_procedimiento: `============================================================
INSTRUCCIONES ESPECÍFICAS - SOP (PROCEDIMIENTO)
============================================================

Tarea/Procedimiento específico a desarrollar: {{tarea_especifica}}

Genera un PROCEDIMIENTO OPERATIVO ESTÁNDAR (SOP) completo que incluya:

1. INFORMACIÓN DEL PROCEDIMIENTO
   - Código: SOP-XXX (proponer)
   - Título: {{tarea_especifica}}
   - Versión: 1.0
   - Fecha: (actual)
   - Instalación afectada
   - Frecuencia de ejecución

2. OBJETIVO
   - Propósito del procedimiento
   - Resultados esperados

3. ALCANCE
   - Qué incluye
   - Qué no incluye

4. RESPONSABILIDADES
   - Responsable de ejecución
   - Responsable de supervisión
   - Responsable de registro

5. NORMATIVA APLICABLE
   - Referencias legales
   - Normas técnicas

6. DOCUMENTOS RELACIONADOS
   - Formularios
   - Registros
   - Otros SOPs

7. EQUIPOS Y MATERIALES NECESARIOS
   - Herramientas
   - EPIs obligatorios
   - Materiales consumibles
   - Instrumentos de medición

8. MEDIDAS DE SEGURIDAD
   - Riesgos identificados
   - Medidas preventivas
   - Actuación en caso de emergencia

9. PROCEDIMIENTO PASO A PASO
   Para cada paso:
   - Número de paso
   - Descripción detallada
   - Criterios de aceptación
   - Tiempo estimado
   - Responsable
   - Observaciones/Precauciones

10. CRITERIOS DE ACEPTACIÓN/RECHAZO
    - Parámetros a verificar
    - Valores de referencia
    - Acciones si NOK

11. REGISTRO Y DOCUMENTACIÓN
    - Qué registrar
    - Dónde registrar
    - Formato de registro (proponer plantilla)
    - Conservación

12. REVISIONES Y ACTUALIZACIONES
    - Frecuencia de revisión del SOP
    - Responsable de revisión

13. ANEXOS
    - Plantilla de registro
    - Diagramas/fotos (describir si procede)
    - Tablas de referencia

FORMATO:
- Numeración clara
- Lenguaje imperativo y directo
- Sin ambigüedades
- Listo para imprimir y usar en campo`
};

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Crear templates
  console.log('📝 Creando templates de prompts...');
  
  const templates = [
    { key: 'base', name: 'Template Base', description: 'Contexto base común a todos los prompts', content: PROMPT_TEMPLATES.base },
    { key: 'plan_integral', name: 'Plan Integral', description: 'Plan completo de mantenimiento', content: PROMPT_TEMPLATES.plan_integral },
    { key: 'plan_por_instalacion', name: 'Plan por Instalación', description: 'Plan detallado para una instalación específica', content: PROMPT_TEMPLATES.plan_por_instalacion },
    { key: 'checklist_operativo', name: 'Checklist Operativo', description: 'Checklists para ejecución diaria', content: PROMPT_TEMPLATES.checklist_operativo },
    { key: 'matriz_legal', name: 'Matriz Legal', description: 'Matriz de obligaciones legales', content: PROMPT_TEMPLATES.matriz_legal },
    { key: 'calendario_mantenimiento', name: 'Calendario', description: 'Calendario anual de mantenimiento', content: PROMPT_TEMPLATES.calendario_mantenimiento },
    { key: 'sop_procedimiento', name: 'SOP Procedimiento', description: 'Procedimiento operativo estándar', content: PROMPT_TEMPLATES.sop_procedimiento }
  ];

  for (const template of templates) {
    await prisma.promptTemplate.upsert({
      where: { key: template.key },
      update: { content: template.content, name: template.name, description: template.description },
      create: template
    });
  }

  console.log('✅ Templates creados');

  // 2. Crear proyecto de ejemplo
  console.log('🏗️  Creando proyecto de ejemplo...');
  
  const project = await prisma.project.create({
    data: {
      name: 'Edificio Industrial - Alcobendas',
      ccaa: 'Madrid',
      municipio: 'Alcobendas',
      usoEdificio: 'Industrial',
      objetivoPlan: 'plan_estandar_profesional',
      criticidad: 'alta',
      notes: 'Nave industrial con oficinas anexas. Actividad: fabricación componentes electrónicos.',
      installations: {
        create: [
          { type: 'PCI', enabled: true },
          { type: 'BT', enabled: true },
          { type: 'HVAC', enabled: true },
          { type: 'LEGIONELLA', enabled: true },
          { type: 'CAI', enabled: true },
          { type: 'FV', enabled: true },
          { type: 'PARARRAYOS', enabled: true }
        ]
      },
      inventory: {
        create: [
          // PCI
          { installationType: 'PCI', fieldKey: 'num_extintores', fieldValue: '45' },
          { installationType: 'PCI', fieldKey: 'num_bocas_incendio', fieldValue: '8' },
          { installationType: 'PCI', fieldKey: 'tiene_rociadores', fieldValue: 'Sí' },
          { installationType: 'PCI', fieldKey: 'tiene_deteccion', fieldValue: 'Sí' },
          { installationType: 'PCI', fieldKey: 'superficie_m2', fieldValue: '3500' },
          
          // BT
          { installationType: 'BT', fieldKey: 'potencia_contratada_kw', fieldValue: '250' },
          { installationType: 'BT', fieldKey: 'tension_nominal', fieldValue: '230/400V' },
          { installationType: 'BT', fieldKey: 'num_cuadros', fieldValue: '12' },
          { installationType: 'BT', fieldKey: 'tiene_sai', fieldValue: 'Sí' },
          { installationType: 'BT', fieldKey: 'tierra_ohms', fieldValue: 'Desconocido' },
          
          // HVAC
          { installationType: 'HVAC', fieldKey: 'tipo_sistema', fieldValue: 'VRV/VRF' },
          { installationType: 'HVAC', fieldKey: 'potencia_frio_kw', fieldValue: '180' },
          { installationType: 'HVAC', fieldKey: 'potencia_calor_kw', fieldValue: '200' },
          { installationType: 'HVAC', fieldKey: 'gas_refrigerante', fieldValue: 'R-410A' },
          { installationType: 'HVAC', fieldKey: 'carga_kg', fieldValue: '85' },
          
          // LEGIONELLA
          { installationType: 'LEGIONELLA', fieldKey: 'tiene_torres_refrigeracion', fieldValue: 'No' },
          { installationType: 'LEGIONELLA', fieldKey: 'tiene_acs', fieldValue: 'Sí' },
          { installationType: 'LEGIONELLA', fieldKey: 'volumen_acumulacion_litros', fieldValue: '1500' },
          { installationType: 'LEGIONELLA', fieldKey: 'tiene_fuentes_ornamentales', fieldValue: 'No' },
          { installationType: 'LEGIONELLA', fieldKey: 'tiene_jacuzzi_spa', fieldValue: 'No' },
          
          // CAI
          { installationType: 'CAI', fieldKey: 'superficie_m2', fieldValue: '3500' },
          { installationType: 'CAI', fieldKey: 'ocupacion_personas', fieldValue: '120' },
          { installationType: 'CAI', fieldKey: 'tipo_ventilacion', fieldValue: 'Mecánica' },
          { installationType: 'CAI', fieldKey: 'tiene_filtros', fieldValue: 'Sí' },
          
          // FV
          { installationType: 'FV', fieldKey: 'potencia_pico_kwp', fieldValue: '100' },
          { installationType: 'FV', fieldKey: 'num_paneles', fieldValue: '250' },
          { installationType: 'FV', fieldKey: 'tipo_instalacion', fieldValue: 'Conectada a red' },
          { installationType: 'FV', fieldKey: 'marca_inversor', fieldValue: 'Desconocido' },
          
          // PARARRAYOS
          { installationType: 'PARARRAYOS', fieldKey: 'tipo', fieldValue: 'PDC' },
          { installationType: 'PARARRAYOS', fieldKey: 'nivel_proteccion', fieldValue: 'II' },
          { installationType: 'PARARRAYOS', fieldKey: 'resistencia_tierra_ohms', fieldValue: 'Desconocido' }
        ]
      }
    }
  });

  console.log('✅ Proyecto de ejemplo creado');
  console.log(`   ID: ${project.id}`);

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('\n📋 Credenciales de acceso:');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
