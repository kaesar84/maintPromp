import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        archived: false
      },
      include: {
        installations: true,
        _count: {
          select: {
            inventory: true,
            versions: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data: Prisma.ProjectCreateInput = {
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
      return NextResponse.json(
        { error: 'Valor de criticidad no válido.' },
        { status: 400 }
      );
    }

    let project;
    try {
      project = await prisma.project.create({
        data,
        include: {
          installations: true
        }
      });
    } catch (createError) {
      // Compatibilidad temporal para entornos con cliente Prisma desactualizado
      // que aún no reconocen el campo solicitarValoracionTemporal.
      const isUnknownTemporalField =
        createError instanceof Prisma.PrismaClientValidationError &&
        createError.message.includes('solicitarValoracionTemporal');

      if (!isUnknownTemporalField) {
        throw createError;
      }

      const { solicitarValoracionTemporal, ...fallbackData } = data as Prisma.ProjectCreateInput & {
        solicitarValoracionTemporal?: boolean;
      };
      project = await prisma.project.create({
        data: fallbackData as Prisma.ProjectCreateInput,
        include: {
          installations: true
        }
      });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2021' || error.code === 'P2022') {
        return NextResponse.json(
          {
            error: 'Base de datos desactualizada. Ejecuta: npm run db:push y reinicia el servidor.'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}
