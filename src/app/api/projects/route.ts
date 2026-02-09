import { NextRequest, NextResponse } from 'next/server';
import { createProject, listProjects } from '@/lib/store';

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = {
      name: String(body.name ?? '').trim(),
      ccaa: String(body.ccaa ?? '').trim(),
      municipio: body.municipio ? String(body.municipio).trim() : null,
      usoEdificio: String(body.usoEdificio ?? '').trim(),
      objetivoPlan: String(body.objetivoPlan ?? 'plan_estandar_profesional'),
      criticidad: String(body.criticidad ?? 'media'),
      solicitarValoracionTemporal: Boolean(body.solicitarValoracionTemporal),
      notes: body.notes ? String(body.notes).trim() : null,
    };

    if (!data.name || !data.ccaa || !data.usoEdificio) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, CCAA y uso del edificio.' },
        { status: 400 }
      );
    }

    const criticidadesValidas = ['baja', 'media', 'alta', 'todas'];
    if (!criticidadesValidas.includes(data.criticidad)) {
      return NextResponse.json({ error: 'Valor de criticidad no válido.' }, { status: 400 });
    }

    const project = await createProject(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}
