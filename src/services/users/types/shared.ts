export const UserRole = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface UserFilterParams {
  status?: string;
  role?: string;
  search?: string;
  gender?: string;
}
