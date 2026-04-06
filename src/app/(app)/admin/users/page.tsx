'use client';

import { usePermission } from '@/hooks/usePermission';
import { Header } from '@/components/layout/Header';

export default function AdminUsersPage() {
  const isAdmin = usePermission(['ADMIN']);

  if (!isAdmin) {
    return (
      <>
        <Header title="Users" />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p>Access denied.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Users" />
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>User management — Módulo 2 (CRUD)</p>
      </div>
    </>
  );
}
