'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
}

export default function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el proyecto "${projectName}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('No se pudo eliminar el proyecto');
      }

      router.refresh();
    } catch (error) {
      alert('Error al eliminar el proyecto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </Button>
  );
}
