// ─── Roles ──────────────────────────────────────────────────────────────────
export type Role = 'ADMIN' | 'OPERADOR' | 'VIEWER';

// ─── API envelope ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AccessTokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── JWT claims (decoded client-side, for UI only) ───────────────────────────
export interface JwtClaims {
  jti: string;
  sub: string; // email
  role: Role;
  iat: number;
  exp: number;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserResponse extends UserResponse {
  temporaryPassword?: string;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password?: string;
  role: Role;
}

export interface UpdateUserRequest {
  fullName?: string;
}

export interface UpdateRoleRequest {
  role: Role;
}

export interface UpdateActiveRequest {
  active: boolean;
}

// ─── Pagination (Spring Page) ────────────────────────────────────────────────
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // zero-based current page
  first: boolean;
  last: boolean;
  empty: boolean;
}
