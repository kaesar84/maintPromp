import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { prisma } from '@/lib/db';
import DeleteProjectButton from '@/components/dashboard/DeleteProjectButton';

export default async function DashboardPage() {
  let projects: any[] = [];
  let dbReady = true;

  try {
    // Obtener todos los proyectos (sin filtro de usuario)
    projects = await prisma.project.findMany({
      where: {
        archived: false
      },
      include: {
        installations: true,
        _count: {
          select: {
            versions: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  } catch (error) {
    dbReady = false;
    console.error('Dashboard DB error:', error);
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-3xl mx-auto px-4 py-16">
          <Card className="p-8">
            <h1 className="text-2xl font-bold mb-3">Base de datos no inicializada</h1>
            <p className="text-gray-600 mb-6">
              El dashboard no puede cargar proyectos porque faltan tablas en SQLite.
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`npm run db:push
npm run db:seed
npm run dev`}
            </pre>
          </Card>
        </main>
      </div>
    );
  }

  const stats = {
    totalProjects: projects.length,
    totalPrompts: projects.reduce((sum, p) => sum + p._count.versions, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔧</span>
            <div>
              <h1 className="text-xl font-bold">Generador de Prompts</h1>
              <p className="text-xs text-gray-600">Mantenimiento Industrial</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Modo Demo
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenido 👋</h2>
          <p className="text-gray-600">Gestiona tus proyectos y genera prompts profesionales de mantenimiento</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-sm opacity-90 mb-2">Proyectos Activos</p>
            <p className="text-4xl font-bold">{stats.totalProjects}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <p className="text-sm opacity-90 mb-2">Prompts Generados</p>
            <p className="text-4xl font-bold">{stats.totalPrompts}</p>
          </Card>

          <Link href="/dashboard/projects/new">
            <Card className="p-6 h-full bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition cursor-pointer">
              <p className="text-sm opacity-90 mb-2">Nuevo Proyecto</p>
              <p className="text-3xl font-bold">+ Crear</p>
            </Card>
          </Link>
        </div>

        {/* Projects List */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Mis Proyectos</h3>
          <Link href="/dashboard/projects/new">
            <Button>+ Nuevo Proyecto</Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No tienes proyectos aún</h3>
            <p className="text-gray-600 mb-6">Crea tu primer proyecto para empezar a generar prompts</p>
            <Link href="/dashboard/projects/new">
              <Button size="lg">Crear Primer Proyecto</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Card key={project.id} className="p-6 hover:shadow-lg transition h-full flex flex-col">
                <Link href={`/dashboard/projects/${project.id}/generate`} className="block">
                  <h4 className="font-bold text-lg mb-2">{project.name}</h4>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>📍 {project.ccaa}{project.municipio ? `, ${project.municipio}` : ''}</p>
                    <p>🏢 {project.usoEdificio}</p>
                    <p>⚙️ {project.installations.length} instalaciones</p>
                  </div>
                </Link>
                <div className="flex items-center justify-between pt-4 border-t mt-auto">
                  <span className="text-xs text-gray-500">
                    {project._count.versions} prompts generados
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.criticidad === 'alta' ? 'bg-red-100 text-red-700' :
                    project.criticidad === 'media' ? 'bg-yellow-100 text-yellow-700' :
                    project.criticidad === 'todas' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {project.criticidad}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Link href={`/dashboard/projects/${project.id}/generate`}>
                    <Button size="sm">Abrir</Button>
                  </Link>
                  <DeleteProjectButton
                    projectId={project.id}
                    projectName={project.name}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Guide */}
        <Card className="mt-12 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>🚀</span> Cómo usar el generador
          </h3>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <span>Crea un proyecto con los datos básicos de tu edificio/instalación</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <span>Selecciona las instalaciones que tiene (PCI, BT, HVAC, etc.)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <span>Rellena el inventario técnico (puedes marcar datos como "Desconocido")</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <span>Genera el prompt del tipo que necesites (Plan Integral, Checklist, Matriz Legal...)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">5.</span>
              <span>Copia el prompt y úsalo en tu LLM favorito (Claude, GPT-4, etc.)</span>
            </li>
          </ol>
        </Card>
      </main>
    </div>
  );
}
