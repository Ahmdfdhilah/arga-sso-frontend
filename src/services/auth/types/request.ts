export interface EmailPasswordLoginRequest {
  email: string;
  password: string;
  client_id?: string;
  device_id?: string;
  fcm_token?: string;
  device_info?: Record<string, unknown>;
}

export interface FirebaseLoginRequest {
  firebase_token: string;
  client_id?: string;
  device_id?: string;
  fcm_token?: string;
  device_info?: Record<string, unknown>;
}

export interface RefreshTokenRequest {
  refresh_token: string;
  device_id: string;
}

export interface SSOTokenExchangeRequest {
  sso_token: string;
  client_id: string;
  device_id?: string;
  fcm_token?: string;
  device_info?: Record<string, unknown>;
}

