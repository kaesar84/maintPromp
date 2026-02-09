'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardContent, Select, Textarea, Label, Checkbox } from '@/components/ui';
import { PROMPT_MODE_LABELS, INSTALLATION_LABELS, InstallationType, PromptMode, INVENTORY_SCHEMAS } from '@/types';
import { Copy, Download, FileText } from 'lucide-react';
import Link from 'next/link';

export default function GeneratePromptPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [modo, setModo] = useState<PromptMode>('plan_integral');
  const [installationFocus, setInstallationFocus] = useState<InstallationType | ''>('');
  const [tareaEspecifica, setTareaEspecifica] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  
  // Formularios
  const [selectedInstallations, setSelectedInstallations] = useState<InstallationType[]>([]);
  const [inventoryData, setInventoryData] = useState<Record<string, Record<string, string>>>({});
  const [step, setStep] = useState<'installations' | 'inventory' | 'generate'>('installations');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        
        // Cargar instalaciones existentes
        if (data.installations && data.installations.length > 0) {
          setSelectedInstallations(data.installations.map((i: any) => i.type));
        }
        
        // Cargar inventario existente
        if (data.inventory) {
          const inv: Record<string, Record<string, string>> = {};
          data.inventory.forEach((item: any) => {
            if (!inv[item.installationType]) {
              inv[item.installationType] = {};
            }
            inv[item.installationType][item.fieldKey] = item.fieldValue;
          });
          setInventoryData(inv);
        }
        
        // Si ya tiene datos, ir directo a generar
        if (data.installations && data.installations.length > 0 && data.inventory && data.inventory.length > 0) {
          setStep('generate');
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveInstallations = async () => {
    try {
      await fetch(`/api/projects/${projectId}/installations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installations: selectedInstallations })
      });
      setStep('inventory');
    } catch (error) {
      console.error('Error saving installations:', error);
    }
  };

  const saveInventory = async () => {
    try {
      const items: any[] = [];
      selectedInstallations.forEach(type => {
        Object.entries(inventoryData[type] || {}).forEach(([fieldKey, fieldValue]) => {
          if (fieldValue) {
            items.push({ installationType: type, fieldKey, fieldValue });
          }
        });
      });

      await fetch(`/api/projects/${projectId}/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      setStep('generate');
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modo,
          installationFocus: modo === 'plan_por_instalacion' ? installationFocus : undefined,
          tareaEspecifica: modo === 'sop_procedimiento' ? tareaEspecifica : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedPrompt(data.prompt);
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      alert('Prompt copiado al portapapeles');
    }
  };

  const handleDownload = (format: 'txt' | 'md') => {
    if (!generatedPrompt) return;
    
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-mantenimiento-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleInstallation = (type: InstallationType) => {
    setSelectedInstallations(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const updateInventoryField = (type: InstallationType, fieldKey: string, value: string) => {
    setInventoryData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [fieldKey]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Volver al Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{project?.name}</h1>
          <p className="text-sm text-gray-600">
            {project?.ccaa} • {project?.usoEdificio}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <button
            onClick={() => setStep('installations')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              step === 'installations' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            <span>1</span> Instalaciones
          </button>
          <div className="w-12 h-0.5 bg-gray-300" />
          <button
            onClick={() => selectedInstallations.length > 0 && setStep('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              step === 'inventory' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
            disabled={selectedInstallations.length === 0}
          >
            <span>2</span> Inventario
          </button>
          <div className="w-12 h-0.5 bg-gray-300" />
          <button
            onClick={() => setStep('generate')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              step === 'generate' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            <span>3</span> Generar
          </button>
        </div>

        {/* Step 1: Installations */}
        {step === 'installations' && (
          <Card>
            <CardHeader>
              <CardTitle>Selecciona las Instalaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(INSTALLATION_LABELS).map(([type, label]) => (
                  <div key={type} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
                    <Checkbox
                      id={type}
                      checked={selectedInstallations.includes(type as InstallationType)}
                      onChange={() => toggleInstallation(type as InstallationType)}
                    />
                    <Label htmlFor={type} className="cursor-pointer flex-1">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
              <Button onClick={saveInstallations} disabled={selectedInstallations.length === 0}>
                Continuar →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Inventory */}
        {step === 'inventory' && (
          <Card>
            <CardHeader>
              <CardTitle>Inventario Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {selectedInstallations.map(type => (
                  <div key={type} className="border-b pb-6">
                    <h3 className="font-semibold text-lg mb-4">{INSTALLATION_LABELS[type]}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {INVENTORY_SCHEMAS[type].map(field => (
                        <div key={field.key}>
                          <Label htmlFor={`${type}-${field.key}`}>
                            {field.label}
                            {field.allowUnknown && <span className="text-gray-500 ml-2">(opcional)</span>}
                          </Label>
                          {field.type === 'select' ? (
                            <Select
                              id={`${type}-${field.key}`}
                              value={inventoryData[type]?.[field.key] || ''}
                              onChange={(e) => updateInventoryField(type, field.key, e.target.value)}
                              className="mt-1"
                            >
                              <option value="">Seleccionar...</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </Select>
                          ) : field.type === 'textarea' ? (
                            <Textarea
                              id={`${type}-${field.key}`}
                              value={inventoryData[type]?.[field.key] || ''}
                              onChange={(e) => updateInventoryField(type, field.key, e.target.value)}
                              rows={2}
                              className="mt-1"
                            />
                          ) : (
                            <input
                              id={`${type}-${field.key}`}
                              type={field.type}
                              value={inventoryData[type]?.[field.key] || ''}
                              onChange={(e) => updateInventoryField(type, field.key, e.target.value)}
                              placeholder={field.placeholder || 'Desconocido'}
                              className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep('installations')} variant="outline">
                  ← Atrás
                </Button>
                <Button onClick={saveInventory}>
                  Continuar →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generate */}
        {step === 'generate' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Generación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="modo">Tipo de Documento *</Label>
                  <Select
                    id="modo"
                    value={modo}
                    onChange={(e) => setModo(e.target.value as PromptMode)}
                    className="mt-1"
                  >
                    {Object.entries(PROMPT_MODE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </Select>
                </div>

                {modo === 'plan_por_instalacion' && (
                  <div>
                    <Label htmlFor="installationFocus">Instalación Específica *</Label>
                    <Select
                      id="installationFocus"
                      value={installationFocus}
                      onChange={(e) => setInstallationFocus(e.target.value as InstallationType)}
                      className="mt-1"
                    >
                      <option value="">Seleccionar...</option>
                      {selectedInstallations.map(type => (
                        <option key={type} value={type}>{INSTALLATION_LABELS[type]}</option>
                      ))}
                    </Select>
                  </div>
                )}

                {modo === 'sop_procedimiento' && (
                  <div>
                    <Label htmlFor="tarea">Tarea o Procedimiento Específico *</Label>
                    <Textarea
                      id="tarea"
                      value={tareaEspecifica}
                      onChange={(e) => setTareaEspecifica(e.target.value)}
                      rows={3}
                      placeholder="Ej: Procedimiento de revisión trimestral de extintores"
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => setStep('inventory')} variant="outline">
                    ← Atrás
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={generating || (modo === 'plan_por_instalacion' && !installationFocus) || (modo === 'sop_procedimiento' && !tareaEspecifica)}
                    className="flex-1"
                  >
                    {generating ? 'Generando...' : '✨ Generar Prompt'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {generatedPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Generado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generatedPrompt}
                    readOnly
                    rows={20}
                    className="font-mono text-sm"
                  />

                  <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" className="flex-1">
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </Button>
                    <Button onClick={() => handleDownload('txt')} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      TXT
                    </Button>
                    <Button onClick={() => handleDownload('md')} variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      MD
                    </Button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ Prompt generado correctamente. Cópialo y pégalo en Claude, ChatGPT o tu LLM favorito para obtener el plan de mantenimiento profesional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
