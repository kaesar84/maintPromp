import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PromptBuilder } from '@/lib/prompt-builder/PromptBuilder';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sin auth - modo demo
    const project = await prisma.project.findFirst({
      where: {
        id: params.id
      },
      include: {
        installations: true,
        inventory: true
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { modo, installationFocus, tareaEspecifica } = body;

    // Obtener templates de la base de datos
    const templates = await prisma.promptTemplate.findMany();
    const templateMap = templates.reduce((acc, t) => {
      acc[t.key] = t.content;
      return acc;
    }, {} as Record<string, string>);

    // Generar prompt usando PromptBuilder
    const builder = new PromptBuilder(templateMap);
    const prompt = builder.build({
      project,
      modo,
      installationFocus,
      tareaEspecifica
    });

    // Guardar versión en historial
    const version = await prisma.promptVersion.create({
      data: {
        projectId: params.id,
        modo,
        installationFocus,
        tareaEspecifica,
        inputSnapshot: JSON.stringify({
          project: {
            name: project.name,
            ccaa: project.ccaa,
            municipio: project.municipio,
            usoEdificio: project.usoEdificio,
            objetivoPlan: project.objetivoPlan,
            criticidad: project.criticidad,
            solicitarValoracionTemporal: project.solicitarValoracionTemporal
          },
          installations: project.installations.map(i => i.type),
          inventory: project.inventory
        }),
        promptGenerated: prompt
      }
    });

    return NextResponse.json({
      prompt,
      versionId: version.id,
      metadata: {
        modo,
        installationFocus,
        tareaEspecifica,
        generatedAt: version.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json({ error: 'Error al generar prompt' }, { status: 500 });
  }
}
