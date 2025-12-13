
import { usersService, type UserListItemResponse } from '@/services';
import type { PaginatedApiResponse } from '@/services/base/types';
import { createSearchHook } from '@/utils/createSearchHooks';

export function useUsersSearch() {
    const searchFunction = (
        term: string,
        limit = 50,
        page = 1,
    ): Promise<PaginatedApiResponse<UserListItemResponse>> =>
        usersService.getUsers({ page, limit, search: term });

    const getByIdFunction = async (id: number | string): Promise<{ data: UserListItemResponse }> => {
        const response = await usersService.getUser(String(id));
        const user: UserListItemResponse = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            avatar_url: response.data.avatar_url,
            alias: response.data.alias,
            gender: response.data.gender,
            date_of_birth: response.data.date_of_birth,
            address: response.data.address,
            bio: response.data.bio,
            status: response.data.status,
            role: response.data.role,
            created_at: response.data.created_at,
        };
        return { data: user };
    };

    return createSearchHook<UserListItemResponse>({
        searchFunction,
        getByIdFunction,
        formatter: (user) => ({
            value: user.id,
            label: user.name,
            description: user.email || undefined,
        }),
    });
}
