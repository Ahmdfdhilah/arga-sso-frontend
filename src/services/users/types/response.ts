import type { UserRole, UserStatus } from './shared';
import type { AllowedApp } from '../../auth/types/response';

export interface UserListItemResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  status: UserStatus;
  role: UserRole;
  created_at: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  status: UserStatus;
  role: UserRole;
  created_at: string;
  updated_at: string;
  allowed_apps: AllowedApp[];
}
