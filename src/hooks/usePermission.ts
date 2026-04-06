import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';

/**
 * Returns true if the current user has one of the allowed roles.
 * UI-only guard — the backend always enforces real access control.
 */
export function usePermission(allowedRoles: Role[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
