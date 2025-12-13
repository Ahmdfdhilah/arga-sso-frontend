export interface AllowedAppResponse {
    id: string;
    code: string;
    name: string;
    description?: string;
    base_url: string;
    icon_url?: string;
    img_url?: string;
    is_active: boolean;
}

export interface ApplicationResponse {
    id: string;
    code: string;
    name: string;
    description?: string;
    base_url: string;
    icon_url?: string;
    img_url?: string;
    is_active: boolean;
    single_session: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApplicationListItemResponse {
    id: string;
    code: string;
    name: string;
    description?: string;
    base_url: string;
    icon_url?: string;
    img_url?: string;
    is_active: boolean;
    single_session: boolean;
    created_at: string;
}
