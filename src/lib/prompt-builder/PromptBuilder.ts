import { INSTALLATION_LABELS, INVENTORY_SCHEMAS, InstallationType, PromptMode } from '@/types';

interface ProjectData {
  name: string;
  ccaa: string;
  municipio?: string | null;
  usoEdificio: string;
  objetivoPlan: string;
  criticidad: string;
  solicitarValoracionTemporal?: boolean;
  notes?: string | null;
  installations: Array<{ type: string; enabled: boolean }>;
  inventory: Array<{
    installationType: string;
    fieldKey: string;
    fieldValue: string;
  }>;
}

export class PromptBuilder {
  private templates: Record<string, string>;

  constructor(templates: Record<string, string>) {
    this.templates = templates;
  }

  build(params: {
    project: ProjectData;
    modo: PromptMode;
    installationFocus?: string;
    tareaEspecifica?: string;
  }): string {
    const { project, modo, installationFocus, tareaEspecifica } = params;

    // Obtener template base y específico
    const baseTemplate = this.templates['base'] || '';
    const modeTemplate = this.templates[modo] || '';

    // Construir inventario técnico solo para instalaciones seleccionadas
    const inventarioTecnico = this.buildInventario(project);

    // Reemplazar placeholders en base
    let prompt = this.replacePlaceholders(baseTemplate, {
      ccaa: project.ccaa,
      municipio: project.municipio || 'No especificado',
      uso_edificio: project.usoEdificio,
      modo_plan: modo,
      instalaciones: this.buildInstallationsList(
        project.installations.map((i) => i.type as InstallationType)
      ),
      inventario_tecnico: inventarioTecnico,
      objetivo_plan: this.mapObjetivoPlan(project.objetivoPlan),
      criticidad: this.mapCriticidad(project.criticidad),
      installation_focus: installationFocus
        ? INSTALLATION_LABELS[installationFocus as InstallationType]
        : '',
      tarea_especifica: tareaEspecifica || '',
    });

    // Añadir instrucciones específicas del modo
    if (modeTemplate) {
      // También reemplazar placeholders en el mode template
      const processedModeTemplate = this.replacePlaceholders(modeTemplate, {
        installation_focus: installationFocus
          ? INSTALLATION_LABELS[installationFocus as InstallationType]
          : '',
        tarea_especifica: tareaEspecifica || '',
      });
      prompt += '\n\n' + processedModeTemplate;
    }

    if (project.solicitarValoracionTemporal) {
      prompt += `\n\n============================================================
INSTRUCCIÓN ADICIONAL - VALORACIÓN TEMPORAL
============================================================

Incluye para cada tarea de mantenimiento una valoración temporal estimada
(horas/operario), diferenciando cuando aplique:
- Tiempo de preparación
- Tiempo de ejecución
- Tiempo de verificación/cierre

Asocia la estimación a su frecuencia y marco normativo aplicable.
Si la norma no define tiempos concretos, indícalo expresamente y aporta
estimación técnica justificada sin presentar el dato como exigencia legal.`;
    }

    return prompt;
  }

  private replacePlaceholders(template: string, values: Record<string, string>): string {
    let result = template;

    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }

  private buildInstallationsList(installations: InstallationType[]): string {
    if (installations.length === 0) {
      return 'Ninguna instalación seleccionada';
    }

    return installations.map((type) => `- ${INSTALLATION_LABELS[type]}`).join('\n');
  }

  private buildInventario(project: ProjectData): string {
    const enabledInstallations = project.installations.filter((i) => i.enabled);

    if (enabledInstallations.length === 0) {
      return 'Sin instalaciones definidas';
    }

    const sections: string[] = [];

    enabledInstallations.forEach((installation) => {
      const type = installation.type as InstallationType;
      const schema = INVENTORY_SCHEMAS[type];
      const items = project.inventory.filter((item) => item.installationType === type);

      let section = `\n### ${INSTALLATION_LABELS[type]}\n`;

      if (items.length === 0) {
        section += 'Sin datos de inventario (considerar como desconocido)\n';
      } else {
        schema.forEach((field) => {
          const item = items.find((i) => i.fieldKey === field.key);
          const value = item?.fieldValue || 'Desconocido';
          section += `- ${field.label}: ${value}\n`;
        });
      }

      sections.push(section);
    });

    return sections.join('\n');
  }

  private mapObjetivoPlan(objetivo: string): string {
    const map: Record<string, string> = {
      cumplimiento_legal_minimo: 'Cumplimiento legal mínimo',
      plan_estandar_profesional: 'Plan estándar profesional',
      alta_disponibilidad: 'Alta disponibilidad / Optimización técnica',
    };
    return map[objetivo] || objetivo;
  }

  private mapCriticidad(criticidad: string): string {
    const map: Record<string, string> = {
      baja: 'Baja',
      media: 'Media',
      alta: 'Alta',
      todas: 'Todas (baja, media y alta)',
    };
    return map[criticidad] || criticidad;
  }
}
