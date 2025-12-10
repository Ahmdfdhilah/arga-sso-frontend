import { BaseService } from '../base/service';
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '../base/types';
import type {
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
  UserListItemResponse,
  UserFilterParams,
} from './types';

class UsersService extends BaseService {
  constructor() {
    super('/users');
  }

  async getMyProfile(): Promise<ApiResponse<UserResponse>> {
    return this.get<ApiResponse<UserResponse>>('/me');
  }

  async updateMyProfile(data: UserUpdateRequest): Promise<ApiResponse<UserResponse>> {
    return this.patch<ApiResponse<UserResponse>>('/me', data);
  }

  async updateMyProfileWithAvatar(data: FormData): Promise<ApiResponse<UserResponse>> {
    return this.patch<ApiResponse<UserResponse>>('/me', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async getUser(userId: string): Promise<ApiResponse<UserResponse>> {
    return this.get<ApiResponse<UserResponse>>(`/${userId}`);
  }

  async getUsers(params?: PaginationParams & UserFilterParams): Promise<PaginatedApiResponse<UserListItemResponse>> {
    return this.get<PaginatedApiResponse<UserListItemResponse>>('', params as Record<string, unknown>);
  }

  async createUser(data: UserCreateRequest): Promise<ApiResponse<UserResponse>> {
    return this.post<ApiResponse<UserResponse>>('', data);
  }

  async updateUser(userId: string, data: UserUpdateRequest): Promise<ApiResponse<UserResponse>> {
    return this.patch<ApiResponse<UserResponse>>(`/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    return this.delete<ApiResponse<null>>(`/${userId}`);
  }
}

export const usersService = new UsersService();
export default usersService;
