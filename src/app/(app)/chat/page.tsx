'use client';

import { usePermission } from '@/hooks/usePermission';
import { Header } from '@/components/layout/Header';

export default function ChatPage() {
  const canAccess = usePermission(['ADMIN', 'OPERADOR']);

  if (!canAccess) {
    return (
      <>
        <Header title="Chat IA" />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p>You do not have permission to access this page.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Chat IA" />
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Chat IA — Módulo 5</p>
      </div>
    </>
  );
}
