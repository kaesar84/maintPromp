import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sin auth - modo demo
    const body = await req.json();
    const { items } = body;

    // Actualizar usando upsert para cada item
    for (const item of items) {
      await prisma.inventoryItem.upsert({
        where: {
          projectId_installationType_fieldKey: {
            projectId: params.id,
            installationType: item.installationType,
            fieldKey: item.fieldKey
          }
        },
        update: {
          fieldValue: item.fieldValue
        },
        create: {
          projectId: params.id,
          installationType: item.installationType,
          fieldKey: item.fieldKey,
          fieldValue: item.fieldValue
        }
      });
    }

    const updated = await prisma.inventoryItem.findMany({
      where: { projectId: params.id }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Error al actualizar inventario' }, { status: 500 });
  }
}
