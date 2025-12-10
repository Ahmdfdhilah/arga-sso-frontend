import type { UserRole, UserStatus } from './shared';

export interface UserCreateRequest {
  name: string;
  email?: string;
  phone?: string;
  avatar_path?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar_path?: string;
  role?: UserRole;
  status?: UserStatus;
}
