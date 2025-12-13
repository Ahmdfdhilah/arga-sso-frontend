export interface ApplicationCreateRequest {
    name: string;
    code: string;
    base_url: string;
    description?: string;
    single_session?: boolean;
}

export interface ApplicationUpdateRequest {
    name?: string;
    code?: string;
    base_url?: string;
    description?: string;
    is_active?: boolean;
    single_session?: boolean;
}

export interface UserApplicationAssignRequest {
    application_ids: string[];
}

export interface ApplicationFilterParams {
    is_active?: boolean;
}
