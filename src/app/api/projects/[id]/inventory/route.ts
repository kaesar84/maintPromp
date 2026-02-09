import { NextRequest, NextResponse } from 'next/server';
import { upsertProjectInventory } from '@/lib/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const updated = await upsertProjectInventory(params.id, items);

    if (!updated) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Error al actualizar inventario' }, { status: 500 });
  }
}
