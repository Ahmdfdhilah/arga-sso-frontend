import { BaseService } from '../base/service';
import type { ApiResponse } from '../base/types';
import type {
  EmailPasswordLoginRequest,
  FirebaseLoginRequest,
  RefreshTokenRequest,
  SSOTokenExchangeRequest,
  LoginResponse,
  RefreshResponse,
  UserData,
  SessionsResponse,
  GoogleAuthUrlResponse,
} from './types';

class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async loginWithEmail(data: EmailPasswordLoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>('/login/email', data);
  }

  async loginWithFirebase(data: FirebaseLoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>('/login/firebase', data);
  }

  async getGoogleAuthUrl(redirectUri: string, state?: string): Promise<ApiResponse<GoogleAuthUrlResponse>> {
    return this.get<ApiResponse<GoogleAuthUrlResponse>>('/login/google', {
      redirect_uri: redirectUri,
      state,
    });
  }

  async googleCallback(
    code: string,
    redirectUri: string,
    clientId?: string,
    fcmToken?: string,
    deviceInfo?: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.get<ApiResponse<LoginResponse>>('/login/google/callback', {
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      fcm_token: fcmToken,
      device_info: deviceInfo,
    });
  }

  async exchangeSSOToken(data: SSOTokenExchangeRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>('/exchange', data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RefreshResponse>> {
    return this.post<ApiResponse<RefreshResponse>>('/refresh', data);
  }

  async logoutFromClient(clientId: string, deviceId?: string): Promise<ApiResponse<null>> {
    const headers: Record<string, string> = { 'X-Client-ID': clientId };
    if (deviceId) {
      headers['X-Device-ID'] = deviceId;
    }
    return this.post<ApiResponse<null>>('/logout/client', undefined, { headers });
  }

  async logoutGlobal(): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>('/logout');
  }

  async validateToken(): Promise<ApiResponse<UserData>> {
    return this.post<ApiResponse<UserData>>('/validate');
  }

  async getSessions(): Promise<ApiResponse<SessionsResponse>> {
    return this.get<ApiResponse<SessionsResponse>>('/sessions');
  }
}

export const authService = new AuthService();
export default authService;
