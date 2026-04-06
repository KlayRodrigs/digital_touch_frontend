'use client';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 items-center border-b bg-card px-6">
      <h2 className="text-base font-semibold">{title}</h2>
    </header>
  );
}
