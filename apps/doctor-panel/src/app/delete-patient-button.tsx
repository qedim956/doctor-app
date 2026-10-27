'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

export function DeletePatientButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`${name} silinsin?`)) return;

    startTransition(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        alert('Xəstəni silmək olmadı');
        return;
      }
      router.refresh();
    });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Silinir...' : 'Sil'}
    </Button>
  );
}