'use client';

import { usePermission } from '@/hooks/usePermission';
import { Header } from '@/components/layout/Header';

export default function AdminRulesPage() {
  const isAdmin = usePermission(['ADMIN']);

  if (!isAdmin) {
    return (
      <>
        <Header title="Rules" />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p>Access denied.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Rules" />
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Rules — Módulo 6</p>
      </div>
    </>
  );
}
