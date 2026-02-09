// ============================================================
// INSTALLATION TYPES
// ============================================================

export type InstallationType =
  | 'PCI'
  | 'BT'
  | 'HVAC'
  | 'LEGIONELLA'
  | 'CAI'
  | 'FONTANERIA'
  | 'SANEAMIENTO'
  | 'FV'
  | 'PARARRAYOS'
  | 'OTRAS';

export const INSTALLATION_LABELS: Record<InstallationType, string> = {
  PCI: 'Protección Contra Incendios',
  BT: 'Baja Tensión',
  HVAC: 'Climatización (HVAC)',
  LEGIONELLA: 'Legionella',
  CAI: 'Calidad Aire Interior',
  FONTANERIA: 'Fontanería',
  SANEAMIENTO: 'Saneamiento',
  FV: 'Fotovoltaica',
  PARARRAYOS: 'Pararrayos',
  OTRAS: 'Otras Instalaciones'
};

// ============================================================
// PROJECT TYPES
// ============================================================

export type ObjetivoPlan =
  | 'cumplimiento_legal_minimo'
  | 'plan_estandar_profesional'
  | 'alta_disponibilidad';

export type Criticidad = 'baja' | 'media' | 'alta' | 'todas';

export interface ProjectBasicData {
  name: string;
  ccaa: string;
  municipio?: string;
  usoEdificio: string;
  objetivoPlan: ObjetivoPlan;
  criticidad: Criticidad;
  solicitarValoracionTemporal: boolean;
  notes?: string;
}

// ============================================================
// INVENTORY TYPES
// ============================================================

export interface InventoryField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
  allowUnknown?: boolean;
}

export const INVENTORY_SCHEMAS: Record<InstallationType, InventoryField[]> = {
  PCI: [
    { key: 'num_extintores', label: 'Nº Extintores', type: 'number', allowUnknown: true },
    { key: 'num_bocas_incendio', label: 'Nº BIEs', type: 'number', allowUnknown: true },
    { key: 'tiene_rociadores', label: 'Rociadores automáticos', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'tiene_deteccion', label: 'Sistema de detección', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'superficie_m2', label: 'Superficie (m²)', type: 'number', allowUnknown: true },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  BT: [
    { key: 'potencia_contratada_kw', label: 'Potencia contratada (kW)', type: 'number', allowUnknown: true },
    { key: 'tension_nominal', label: 'Tensión nominal', type: 'select', options: ['230/400V', 'Otra', 'Desconocido'] },
    { key: 'num_cuadros', label: 'Nº Cuadros eléctricos', type: 'number', allowUnknown: true },
    { key: 'tiene_sai', label: 'Sistema SAI/UPS', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'tierra_ohms', label: 'Resistencia tierra (Ω)', type: 'text', allowUnknown: true },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  HVAC: [
    { key: 'tipo_sistema', label: 'Tipo de sistema', type: 'select', options: ['VRV/VRF', 'Split', 'Conductos', 'Fan-coil', 'Otro', 'Desconocido'] },
    { key: 'potencia_frio_kw', label: 'Potencia frío (kW)', type: 'number', allowUnknown: true },
    { key: 'potencia_calor_kw', label: 'Potencia calor (kW)', type: 'number', allowUnknown: true },
    { key: 'gas_refrigerante', label: 'Gas refrigerante', type: 'text', placeholder: 'R-410A, R-32...', allowUnknown: true },
    { key: 'carga_kg', label: 'Carga refrigerante (kg)', type: 'number', allowUnknown: true },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  LEGIONELLA: [
    { key: 'tiene_torres_refrigeracion', label: 'Torres de refrigeración', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'tiene_acs', label: 'ACS centralizado', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'volumen_acumulacion_litros', label: 'Volumen acumulación ACS (L)', type: 'number', allowUnknown: true },
    { key: 'tiene_fuentes_ornamentales', label: 'Fuentes ornamentales', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'tiene_jacuzzi_spa', label: 'Jacuzzi/SPA', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  CAI: [
    { key: 'superficie_m2', label: 'Superficie (m²)', type: 'number', allowUnknown: true },
    { key: 'ocupacion_personas', label: 'Ocupación (personas)', type: 'number', allowUnknown: true },
    { key: 'tipo_ventilacion', label: 'Tipo de ventilación', type: 'select', options: ['Natural', 'Mecánica', 'Híbrida', 'Desconocido'] },
    { key: 'tiene_filtros', label: 'Sistema de filtración', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  FONTANERIA: [
    { key: 'num_grifos', label: 'Nº Puntos de consumo', type: 'number', allowUnknown: true },
    { key: 'material_tuberias', label: 'Material tuberías', type: 'select', options: ['Cobre', 'PVC', 'Polietileno', 'Acero', 'Otro', 'Desconocido'] },
    { key: 'tiene_grupo_presion', label: 'Grupo de presión', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  SANEAMIENTO: [
    { key: 'tipo_red', label: 'Tipo de red', type: 'select', options: ['Unitaria', 'Separativa', 'Desconocido'] },
    { key: 'tiene_separador_grasas', label: 'Separador de grasas', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'tiene_fosa_septica', label: 'Fosa séptica', type: 'select', options: ['Sí', 'No', 'Desconocido'] },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  FV: [
    { key: 'potencia_pico_kwp', label: 'Potencia pico (kWp)', type: 'number', allowUnknown: true },
    { key: 'num_paneles', label: 'Nº Paneles', type: 'number', allowUnknown: true },
    { key: 'tipo_instalacion', label: 'Tipo', type: 'select', options: ['Aislada', 'Conectada a red', 'Híbrida', 'Desconocido'] },
    { key: 'marca_inversor', label: 'Marca inversor', type: 'text', allowUnknown: true },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  PARARRAYOS: [
    { key: 'tipo', label: 'Tipo de pararrayos', type: 'select', options: ['PDC', 'Punta Franklin', 'Malla', 'Otro', 'Desconocido'] },
    { key: 'nivel_proteccion', label: 'Nivel de protección', type: 'select', options: ['I', 'II', 'III', 'IV', 'Desconocido'] },
    { key: 'resistencia_tierra_ohms', label: 'Resistencia tierra (Ω)', type: 'text', allowUnknown: true },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ],
  OTRAS: [
    { key: 'descripcion', label: 'Descripción', type: 'textarea' },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ]
};

// ============================================================
// PROMPT GENERATION TYPES
// ============================================================

export type PromptMode =
  | 'plan_integral'
  | 'plan_por_instalacion'
  | 'checklist_operativo'
  | 'matriz_legal'
  | 'calendario_mantenimiento'
  | 'sop_procedimiento';

export const PROMPT_MODE_LABELS: Record<PromptMode, string> = {
  plan_integral: 'Plan Integral de Mantenimiento',
  plan_por_instalacion: 'Plan Específico por Instalación',
  checklist_operativo: 'Checklist Operativo',
  matriz_legal: 'Matriz Legal de Obligaciones',
  calendario_mantenimiento: 'Calendario Anual de Mantenimiento',
  sop_procedimiento: 'SOP - Procedimiento Específico'
};

export interface GeneratePromptRequest {
  modo: PromptMode;
  installationFocus?: InstallationType;
  tareaEspecifica?: string;
}

export interface GeneratePromptResponse {
  prompt: string;
  versionId: string;
  metadata: {
    modo: PromptMode;
    installationFocus?: InstallationType;
    tareaEspecifica?: string;
    generatedAt: string;
  };
}
