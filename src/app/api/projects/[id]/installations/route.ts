import { NextRequest, NextResponse } from 'next/server';
import { setProjectInstallations } from '@/lib/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const installations = Array.isArray(body.installations) ? body.installations : [];
    const updated = await setProjectInstallations(params.id, installations);

    if (!updated) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating installations:', error);
    return NextResponse.json({ error: 'Error al actualizar instalaciones' }, { status: 500 });
  }
}
