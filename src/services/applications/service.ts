import { BaseService } from '../base/service';
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '../base/types';
import type {
    ApplicationResponse,
    ApplicationListItemResponse,
    AllowedAppResponse,
    UserApplicationAssignRequest,
    ApplicationFilterParams,
} from './types';

class ApplicationsService extends BaseService {
    constructor() {
        super('/applications');
    }

    async getMyApplications(): Promise<ApiResponse<AllowedAppResponse[]>> {
        return this.get<ApiResponse<AllowedAppResponse[]>>('/my-apps');
    }

    async getApplications(params?: PaginationParams & ApplicationFilterParams): Promise<PaginatedApiResponse<ApplicationListItemResponse>> {
        return this.get<PaginatedApiResponse<ApplicationListItemResponse>>('', params as Record<string, unknown>);
    }

    async getApplication(appId: string): Promise<ApiResponse<ApplicationResponse>> {
        return this.get<ApiResponse<ApplicationResponse>>(`/${appId}`);
    }

    async createApplication(data: FormData): Promise<ApiResponse<ApplicationResponse>> {
        return this.post<ApiResponse<ApplicationResponse>>('', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async updateApplication(appId: string, data: FormData): Promise<ApiResponse<ApplicationResponse>> {
        return this.patch<ApiResponse<ApplicationResponse>>(`/${appId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async deleteApplication(appId: string): Promise<ApiResponse<null>> {
        return this.delete<ApiResponse<null>>(`/${appId}`);
    }

    async getUserApplications(userId: string): Promise<ApiResponse<AllowedAppResponse[]>> {
        return this.get<ApiResponse<AllowedAppResponse[]>>(`/user/${userId}`);
    }

    async assignApplicationsToUser(userId: string, data: UserApplicationAssignRequest): Promise<ApiResponse<AllowedAppResponse[]>> {
        return this.post<ApiResponse<AllowedAppResponse[]>>(`/user/${userId}/assign`, data);
    }

    async removeApplicationFromUser(userId: string, appId: string): Promise<ApiResponse<null>> {
        return this.delete<ApiResponse<null>>(`/user/${userId}/${appId}`);
    }
}

export const applicationsService = new ApplicationsService();
export default applicationsService;
