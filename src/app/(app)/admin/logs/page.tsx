'use client';

import { usePermission } from '@/hooks/usePermission';
import { Header } from '@/components/layout/Header';

export default function AdminLogsPage() {
  const isAdmin = usePermission(['ADMIN']);

  if (!isAdmin) {
    return (
      <>
        <Header title="Logs" />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p>Access denied.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Logs" />
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Logs — Módulo 7</p>
      </div>
    </>
  );
}
