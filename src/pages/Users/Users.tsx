import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FilterCard from '@/components/common/FilterCard';
import Pagination from '@/components/common/PaginationCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
    UsersTableView,
    UsersCardView,
    UsersFormDialog,
    UsersDetailDialog,
} from '@/components/users';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User as UserIcon, Shield, Filter as FilterIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useURLQuery } from '@/hooks/useURLQuery';
import { usersService } from '@/services';
import type {
    UserListItemResponse,
    UserCreateRequest,
    UserUpdateRequest,
    UserFilterParams,
} from '@/services/users/types';
import type { PaginationParams } from '@/services/base/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { UserRole, UserStatus } from '@/services/users/types';

export function Users() {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuthStore();
    const [formOpen, setFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserListItemResponse | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserListItemResponse | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [userToView, setUserToView] = useState<UserListItemResponse | null>(null);

    const canCreate = currentUser?.role === UserRole.SUPERADMIN || currentUser?.role === UserRole.ADMIN;
    const canUpdate = currentUser?.role === UserRole.SUPERADMIN || currentUser?.role === UserRole.ADMIN;
    const canDelete = currentUser?.role === UserRole.SUPERADMIN;

    const urlFiltersHook = useURLQuery<UserFilterParams & PaginationParams>({
        defaults: {
            page: 1,
            limit: 20,
            search: '',
            gender: '',
            status: '',
            role: '',
        },
        cleanDefaults: true,
    });

    const filters = urlFiltersHook.getCurrentFilters();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['users', filters],
        queryFn: () => usersService.getUsers(filters),
    });

    const createMutation = useMutation({
        mutationFn: (data: UserCreateRequest) => usersService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User berhasil ditambahkan');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Gagal menambahkan user';
            toast.error(message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UserUpdateRequest }) =>
            usersService.updateUser(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User berhasil diperbarui');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Gagal memperbarui user';
            toast.error(message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => usersService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User berhasil dihapus');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Gagal menghapus user';
            toast.error(message);
        },
    });

    const handleSearch = (value: string) => {
        urlFiltersHook.updateURL({ search: value, page: 1 });
    };

    const handleClearFilters = () => {
        urlFiltersHook.resetFilters();
    };

    const handleItemsPerPageChange = (value: string) => {
        urlFiltersHook.updateURL({ limit: parseInt(value), page: 1 });
    };

    const hasActiveFilters = urlFiltersHook.hasActiveFilters();
    const isDesktop = window.innerWidth >= 768;

    const handleCreate = () => {
        setSelectedUser(null);
        setFormOpen(true);
    };

    const handleView = (user: UserListItemResponse) => {
        setUserToView(user);
        setDetailDialogOpen(true);
    };

    const handleEdit = (user: UserListItemResponse) => {
        setSelectedUser(user);
        setFormOpen(true);
    };

    const handleDelete = (user: UserListItemResponse) => {
        setUserToDelete(user);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;
        deleteMutation.mutate(userToDelete.id, {
            onSuccess: () => {
                setConfirmOpen(false);
                setUserToDelete(null);
            },
        });
    };

    const handleSubmit = (formData: UserCreateRequest | UserUpdateRequest) => {
        if (selectedUser) {
            updateMutation.mutate(
                { userId: selectedUser.id, data: formData as UserUpdateRequest },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setSelectedUser(null);
                    },
                },
            );
        } else {
            createMutation.mutate(formData as UserCreateRequest, {
                onSuccess: () => {
                    setFormOpen(false);
                },
            });
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen User</h1>
                        <p className="text-muted-foreground">Kelola data user sistem</p>
                    </div>
                    {canCreate && (
                        <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah User
                        </Button>
                    )}
                </div>

                <FilterCard
                    searchValue={filters.search || ''}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Cari berdasarkan nama atau email..."
                    onClearFilters={handleClearFilters}
                    showClearButton={hasActiveFilters}
                >
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={filters.gender || 'all'}
                                onValueChange={(value) => {
                                    urlFiltersHook.updateURL({
                                        gender: value === 'all' ? '' : value,
                                        page: 1,
                                    });
                                }}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Semua Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Gender</SelectItem>
                                    <SelectItem value="male">Laki-laki</SelectItem>
                                    <SelectItem value="female">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={filters.role || 'all'}
                                onValueChange={(value) => {
                                    urlFiltersHook.updateURL({
                                        role: value === 'all' ? '' : value,
                                        page: 1,
                                    });
                                }}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Semua Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    <SelectItem value={UserRole.SUPERADMIN}>Superadmin</SelectItem>
                                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={UserRole.USER}>User</SelectItem>
                                    <SelectItem value={UserRole.GUEST}>Guest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center gap-2">
                            <FilterIcon className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => {
                                    urlFiltersHook.updateURL({
                                        status: value === 'all' ? '' : value,
                                        page: 1,
                                    });
                                }}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                                    <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                                    <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </FilterCard>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        )}

                        {isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error instanceof Error ? error.message : 'Gagal memuat data user'}
                                </AlertDescription>
                            </Alert>
                        )}

                        {!isLoading && !isError && data && data.data.length === 0 && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-semibold">
                                    {hasActiveFilters ? 'Tidak Ada Hasil' : 'Tidak Ada Data'}
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    {hasActiveFilters
                                        ? 'Tidak ada user yang sesuai dengan filter'
                                        : 'Belum ada user yang terdaftar'}
                                </p>
                                {hasActiveFilters ? (
                                    <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                                        Hapus Filter
                                    </Button>
                                ) : (
                                    canCreate && (
                                        <Button className="mt-4" onClick={handleCreate}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah User
                                        </Button>
                                    )
                                )}
                            </div>
                        )}

                        {!isLoading && !isError && data && data.data.length > 0 && (
                            <>
                                {isDesktop ? (
                                    <UsersTableView
                                        users={data.data}
                                        onView={handleView}
                                        onEdit={canUpdate ? handleEdit : undefined}
                                        onDelete={canDelete ? handleDelete : undefined}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {data.data.map((user) => (
                                            <UsersCardView
                                                key={user.id}
                                                user={user}
                                                onView={handleView}
                                                onEdit={canUpdate ? handleEdit : undefined}
                                                onDelete={canDelete ? handleDelete : undefined}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && !isError && data && data.meta && (
                    <Pagination
                        currentPage={filters.page || 1}
                        totalPages={data.meta.total_pages}
                        onPageChange={(page) => urlFiltersHook.updateURL({ page })}
                        totalItems={data.meta.total_items}
                        itemsPerPage={filters.limit || 20}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}

                <UsersFormDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    user={selectedUser}
                    onSubmit={handleSubmit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />

                <UsersDetailDialog
                    open={detailDialogOpen}
                    onOpenChange={setDetailDialogOpen}
                    user={userToView}
                />

                <ConfirmDialog
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title="Hapus User?"
                    description={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"?`}
                    variant="danger"
                    onConfirm={confirmDelete}
                    isProcessing={deleteMutation.isPending}
                    confirmText="Hapus"
                    cancelText="Batal"
                />
            </div>
        </>
    );
}

export default Users;
