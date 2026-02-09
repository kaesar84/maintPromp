import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface StoreInstallation {
  id: string;
  projectId: string;
  type: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInventoryItem {
  id: string;
  projectId: string;
  installationType: string;
  fieldKey: string;
  fieldValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorePromptVersion {
  id: string;
  projectId: string;
  modo: string;
  installationFocus?: string;
  tareaEspecifica?: string;
  inputSnapshot: string;
  promptGenerated: string;
  createdAt: string;
}

export interface StoreProject {
  id: string;
  name: string;
  ccaa: string;
  municipio: string | null;
  usoEdificio: string;
  objetivoPlan: string;
  criticidad: string;
  solicitarValoracionTemporal: boolean;
  notes: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  installations: StoreInstallation[];
  inventory: StoreInventoryItem[];
  versions: StorePromptVersion[];
}

interface StoreData {
  projects: StoreProject[];
}

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'store.json');

function nowISO() {
  return new Date().toISOString();
}

function getInitialData(): StoreData {
  return { projects: [] };
}

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(getInitialData(), null, 2), 'utf-8');
  }
}

async function readStore(): Promise<StoreData> {
  await ensureStoreFile();
  const raw = await fs.readFile(dataFile, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as StoreData;
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      return getInitialData();
    }
    return {
      projects: parsed.projects.map((project) => ({
        ...project,
        municipio: project.municipio ?? null,
        solicitarValoracionTemporal: Boolean(project.solicitarValoracionTemporal),
        notes: project.notes ?? null,
        archived: Boolean(project.archived),
        installations: Array.isArray(project.installations) ? project.installations : [],
        inventory: Array.isArray(project.inventory) ? project.inventory : [],
        versions: Array.isArray(project.versions) ? project.versions : [],
      })),
    };
  } catch {
    return getInitialData();
  }
}

async function writeStore(data: StoreData) {
  await ensureStoreFile();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}

export function projectWithCounts(project: StoreProject) {
  return {
    ...project,
    _count: {
      inventory: project.inventory.length,
      versions: project.versions.length,
    },
  };
}

export async function listProjects() {
  const store = await readStore();
  return store.projects
    .filter((p) => !p.archived)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map(projectWithCounts);
}

export async function createProject(data: {
  name: string;
  ccaa: string;
  municipio?: string | null;
  usoEdificio: string;
  objetivoPlan: string;
  criticidad: string;
  solicitarValoracionTemporal?: boolean;
  notes?: string | null;
}) {
  const store = await readStore();
  const timestamp = nowISO();

  const project: StoreProject = {
    id: randomUUID(),
    name: data.name,
    ccaa: data.ccaa,
    municipio: data.municipio ?? null,
    usoEdificio: data.usoEdificio,
    objetivoPlan: data.objetivoPlan,
    criticidad: data.criticidad,
    solicitarValoracionTemporal: Boolean(data.solicitarValoracionTemporal),
    notes: data.notes ?? null,
    archived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    installations: [],
    inventory: [],
    versions: [],
  };

  store.projects.push(project);
  await writeStore(store);
  return project;
}

export async function getProjectById(id: string) {
  const store = await readStore();
  return store.projects.find((p) => p.id === id) ?? null;
}

export async function updateProjectById(
  id: string,
  patch: Partial<
    Pick<
      StoreProject,
      | 'name'
      | 'ccaa'
      | 'municipio'
      | 'usoEdificio'
      | 'objetivoPlan'
      | 'criticidad'
      | 'solicitarValoracionTemporal'
      | 'notes'
      | 'archived'
    >
  >
) {
  const store = await readStore();
  const project = store.projects.find((p) => p.id === id);
  if (!project) return null;

  Object.assign(project, patch, { updatedAt: nowISO() });
  await writeStore(store);
  return project;
}

export async function deleteProjectById(id: string) {
  const store = await readStore();
  const before = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id);
  if (store.projects.length === before) {
    return false;
  }
  await writeStore(store);
  return true;
}

export async function setProjectInstallations(id: string, installationTypes: string[]) {
  const store = await readStore();
  const project = store.projects.find((p) => p.id === id);
  if (!project) return null;

  const timestamp = nowISO();
  project.installations = installationTypes.map((type) => ({
    id: randomUUID(),
    projectId: id,
    type,
    enabled: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
  project.updatedAt = timestamp;

  await writeStore(store);
  return project.installations;
}

export async function upsertProjectInventory(
  id: string,
  items: Array<{ installationType: string; fieldKey: string; fieldValue: string }>
) {
  const store = await readStore();
  const project = store.projects.find((p) => p.id === id);
  if (!project) return null;

  const timestamp = nowISO();
  const map = new Map<string, StoreInventoryItem>(
    project.inventory.map((item) => [`${item.installationType}|${item.fieldKey}`, item])
  );

  for (const item of items) {
    const key = `${item.installationType}|${item.fieldKey}`;
    const current = map.get(key);

    if (current) {
      current.fieldValue = item.fieldValue;
      current.updatedAt = timestamp;
    } else {
      map.set(key, {
        id: randomUUID(),
        projectId: id,
        installationType: item.installationType,
        fieldKey: item.fieldKey,
        fieldValue: item.fieldValue,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  }

  project.inventory = Array.from(map.values());
  project.updatedAt = timestamp;
  await writeStore(store);
  return project.inventory;
}

export async function addPromptVersion(
  id: string,
  data: {
    modo: string;
    installationFocus?: string;
    tareaEspecifica?: string;
    inputSnapshot: string;
    promptGenerated: string;
  }
) {
  const store = await readStore();
  const project = store.projects.find((p) => p.id === id);
  if (!project) return null;

  const version: StorePromptVersion = {
    id: randomUUID(),
    projectId: id,
    modo: data.modo,
    installationFocus: data.installationFocus,
    tareaEspecifica: data.tareaEspecifica,
    inputSnapshot: data.inputSnapshot,
    promptGenerated: data.promptGenerated,
    createdAt: nowISO(),
  };

  project.versions.unshift(version);
  project.updatedAt = nowISO();
  await writeStore(store);
  return version;
}
