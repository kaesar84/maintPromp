import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sin verificación de auth - modo demo
    const body = await req.json();
    const { installations } = body;

    // Eliminar instalaciones existentes
    await prisma.installation.deleteMany({
      where: { projectId: params.id }
    });

    // Crear nuevas instalaciones
    if (installations && installations.length > 0) {
      await prisma.installation.createMany({
        data: installations.map((type: string) => ({
          projectId: params.id,
          type,
          enabled: true
        }))
      });
    }

    const updated = await prisma.installation.findMany({
      where: { projectId: params.id }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating installations:', error);
    return NextResponse.json({ error: 'Error al actualizar instalaciones' }, { status: 500 });
  }
}
