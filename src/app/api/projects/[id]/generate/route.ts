import { NextRequest, NextResponse } from 'next/server';
import { PromptBuilder } from '@/lib/prompt-builder/PromptBuilder';
import { DEFAULT_PROMPT_TEMPLATES } from '@/lib/prompt-builder/defaultTemplates';
import { addPromptVersion, getProjectById } from '@/lib/store';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProjectById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { modo, installationFocus, tareaEspecifica } = body;

    const builder = new PromptBuilder(DEFAULT_PROMPT_TEMPLATES);
    const prompt = builder.build({
      project,
      modo,
      installationFocus,
      tareaEspecifica
    });

    const version = await addPromptVersion(params.id, {
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
    });

    if (!version) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      prompt,
      versionId: version.id,
      metadata: {
        modo,
        installationFocus,
        tareaEspecifica,
        generatedAt: version.createdAt
      }
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json({ error: 'Error al generar prompt' }, { status: 500 });
  }
}
