'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent, Select, Textarea, Checkbox } from '@/components/ui';
import Link from 'next/link';
import { Info } from 'lucide-react';

const CCAA_OPTIONS = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja', 'Ceuta', 'Melilla'
];

const CRITICIDAD_HELP: Record<string, string> = {
  baja: 'Instalaciones no críticas. El fallo no detiene la operación global.',
  media: 'Impacto relevante en servicio o cumplimiento, pero controlable.',
  alta: 'Impacto severo en seguridad, legalidad o continuidad de negocio.',
  todas: 'Incluye escenarios de criticidad baja, media y alta en el plan.',
};

function HelpTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={text}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-left text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function FieldLabel({
  htmlFor,
  text,
  tooltip
}: {
  htmlFor: string;
  text: string;
  tooltip: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{text}</Label>
      <HelpTooltip text={tooltip} />
    </div>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    ccaa: '',
    municipio: '',
    usoEdificio: '',
    objetivoPlan: 'plan_estandar_profesional',
    criticidad: 'media',
    solicitarValoracionTemporal: false,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const project = await res.json();
        router.push(`/dashboard/projects/${project.id}/generate`);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al crear proyecto');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Volver al Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Crear Nuevo Proyecto</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <FieldLabel
                  htmlFor="name"
                  text="Nombre del Proyecto *"
                  tooltip="Usa un nombre claro y único para identificar rápido la instalación o edificio."
                />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Edificio Oficinas Central"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel
                    htmlFor="ccaa"
                    text="Comunidad Autónoma *"
                    tooltip="Ayuda a contextualizar requisitos normativos y operativos por ubicación."
                  />
                  <Select
                    id="ccaa"
                    value={formData.ccaa}
                    onChange={(e) => setFormData({ ...formData, ccaa: e.target.value })}
                    required
                    className="mt-1"
                  >
                    <option value="">Selecciona CCAA</option>
                    {CCAA_OPTIONS.map(ccaa => (
                      <option key={ccaa} value={ccaa}>{ccaa}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <FieldLabel
                    htmlFor="municipio"
                    text="Municipio"
                    tooltip="Completarlo mejora el contexto local del plan y posibles validaciones municipales."
                  />
                  <Input
                    id="municipio"
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    placeholder="Ej: Alcobendas"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <FieldLabel
                  htmlFor="usoEdificio"
                  text="Uso del Edificio *"
                  tooltip="Indica la actividad principal: industrial, oficinas, comercial, residencial, etc."
                />
                <Input
                  id="usoEdificio"
                  value={formData.usoEdificio}
                  onChange={(e) => setFormData({ ...formData, usoEdificio: e.target.value })}
                  placeholder="Ej: Industrial, Oficinas, Residencial, Comercial..."
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel
                    htmlFor="objetivoPlan"
                    text="Objetivo del Plan *"
                    tooltip="Define el enfoque: legal mínimo, estándar profesional o alta disponibilidad."
                  />
                  <Select
                    id="objetivoPlan"
                    value={formData.objetivoPlan}
                    onChange={(e) => setFormData({ ...formData, objetivoPlan: e.target.value })}
                    className="mt-1"
                  >
                    <option value="cumplimiento_legal_minimo">Cumplimiento legal mínimo</option>
                    <option value="plan_estandar_profesional">Plan estándar profesional</option>
                    <option value="alta_disponibilidad">Alta disponibilidad / Optimización</option>
                  </Select>
                </div>

                <div>
                  <FieldLabel
                    htmlFor="criticidad"
                    text="Criticidad *"
                    tooltip="Selecciona el impacto esperado de fallos: baja, media, alta o todas."
                  />
                  <Select
                    id="criticidad"
                    value={formData.criticidad}
                    onChange={(e) => setFormData({ ...formData, criticidad: e.target.value })}
                    className="mt-1"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="todas">Todas</option>
                  </Select>
                </div>
              </div>

              <div>
                <FieldLabel
                  htmlFor="solicitarValoracionTemporal"
                  text="Valoración temporal según normativa"
                  tooltip="Si lo activas, el prompt pedirá estimar duración de tareas por tipología y frecuencia normativa."
                />
                <div className="mt-2 flex items-start gap-3 rounded-md border border-gray-200 bg-white p-3">
                  <Checkbox
                    id="solicitarValoracionTemporal"
                    checked={formData.solicitarValoracionTemporal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        solicitarValoracionTemporal: e.target.checked
                      })
                    }
                  />
                  <Label htmlFor="solicitarValoracionTemporal" className="cursor-pointer text-sm leading-5">
                    Incluir en el plan una valoración temporal estimada de las tareas (horas/operario), con enfoque
                    alineado a periodicidades y exigencias normativas.
                  </Label>
                </div>
              </div>

              <div>
                <FieldLabel
                  htmlFor="notes"
                  text="Notas Adicionales"
                  tooltip="Añade restricciones, histórico de averías o prioridades de negocio para afinar el resultado."
                />
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="Información adicional relevante..."
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creando...' : 'Crear Proyecto'}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Ayuda para completar los datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <p>
              Este bloque te ayuda a interpretar cada campo para que el plan generado sea más útil y más preciso.
            </p>
            <div>
              <p className="font-semibold">Nombre del Proyecto</p>
              <p>Usa una referencia clara y única. Ejemplo: &quot;Planta Logística Norte&quot;.</p>
            </div>
            <div>
              <p className="font-semibold">Comunidad Autónoma y Municipio</p>
              <p>Sirve para contextualizar requisitos normativos y operativos por ubicación.</p>
            </div>
            <div>
              <p className="font-semibold">Uso del Edificio</p>
              <p>Describe la actividad principal: industrial, oficinas, comercial, residencial, etc.</p>
            </div>
            <div>
              <p className="font-semibold">Objetivo del Plan</p>
              <p>
                <span className="font-medium">Cumplimiento legal mínimo</span> prioriza obligaciones.
                <span className="font-medium"> Plan estándar profesional</span> equilibra cumplimiento y operativa.
                <span className="font-medium"> Alta disponibilidad</span> orienta a continuidad, redundancia y reducción
                de paradas.
              </p>
            </div>
            <div>
              <p className="font-semibold">Criticidad</p>
              <p className="mb-1">Selecciona el nivel dominante del proyecto:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">Baja:</span> {CRITICIDAD_HELP.baja}</li>
                <li><span className="font-medium">Media:</span> {CRITICIDAD_HELP.media}</li>
                <li><span className="font-medium">Alta:</span> {CRITICIDAD_HELP.alta}</li>
                <li><span className="font-medium">Todas:</span> {CRITICIDAD_HELP.todas}</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Valoración temporal según normativa</p>
              <p>
                Si activas esta opción, el resultado incluirá una estimación temporal de las tareas de mantenimiento,
                considerando frecuencia y enfoque normativo.
              </p>
            </div>
            <div>
              <p className="font-semibold">Notas Adicionales</p>
              <p>
                Añade restricciones, histórico de fallos, prioridades de negocio o cualquier contexto especial.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
