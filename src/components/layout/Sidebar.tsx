'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  Users,
  BookOpen,
  ScrollText,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const commonItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ClipboardList },
];

const operatorItems: NavItem[] = [
  { href: '/chat', label: 'Chat IA', icon: MessageSquare },
];

const adminItems: NavItem[] = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/rules', label: 'Rules', icon: BookOpen },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = usePermission(['ADMIN']);
  const canChat = usePermission(['ADMIN', 'OPERADOR']);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-card px-3 py-4">
      {/* Brand */}
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold tracking-tight">Digital Touch</h1>
        {user && (
          <div className="mt-1 flex items-center gap-2">
            <span className="truncate text-xs text-muted-foreground">
              {user.sub}
            </span>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {user.role}
            </Badge>
          </div>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {commonItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {canChat &&
          operatorItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}

        {isAdmin && (
          <>
            <Separator className="my-2" />
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </p>
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </>
        )}
      </nav>

      <Separator className="mb-4" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
