export interface AllowedApp {
  id: string;
  code: string;
  name: string;
}

export interface UserData {
  id: string;
  role: string;
  name?: string;
  email?: string;
  allowed_apps: AllowedApp[];
}

export interface LoginResponse {
  sso_token: string;
  access_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  user: UserData;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface SessionInfo {
  device_id: string;
  device_info?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  last_activity: string;
}

export interface SessionsResponse {
  sessions: Record<string, SessionInfo[]>;
  total_clients: number;
  total_sessions: number;
}

export interface GoogleAuthUrlResponse {
  auth_url: string;
}
