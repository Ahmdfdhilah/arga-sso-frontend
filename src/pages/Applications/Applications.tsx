import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FolderOpen } from 'lucide-react';
import {
    ApplicationsTableView,
    ApplicationsCardView,
    ApplicationsFormDialog,
    ApplicationsDetailDialog,
} from '@/components/applications';
import { FilterCard } from '@/components/common/FilterCard';
import PaginationCard from '@/components/common/PaginationCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { applicationsService } from '@/services/applications';
import type { ApplicationListItemResponse, ApplicationResponse, ApplicationFilterParams } from '@/services/applications/types';
import type { PaginationParams } from '@/services/base/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useURLQuery } from '@/hooks/useURLQuery';

export function Applications() {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuthStore();
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [appToEdit, setAppToEdit] = useState<ApplicationListItemResponse | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState<ApplicationListItemResponse | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [appToView, setAppToView] = useState<ApplicationResponse | null>(null);

    const canCreate = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
    const canUpdate = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
    const canDelete = currentUser?.role === 'superadmin';

    const urlFiltersHook = useURLQuery<ApplicationFilterParams & PaginationParams & { search?: string; status?: string }>({
        defaults: {
            page: 1,
            limit: 20,
            search: '',
            status: 'all',
        },
    });

    const { getCurrentFilters, updateURL, resetFilters } = urlFiltersHook;
    const queryParams = getCurrentFilters();

    const {
        data: applicationsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['applications', queryParams],
        queryFn: () => {
            const params: PaginationParams & Partial<ApplicationFilterParams> = {
                page: queryParams.page || 1,
                limit: queryParams.limit || 20,
            };

            if (queryParams.status && queryParams.status !== 'all') {
                params.is_active = queryParams.status === 'active';
            }

            return applicationsService.getApplications(params);
        },
    });

    const { data: appDetailData } = useQuery({
        queryKey: ['application', appToView?.id],
        queryFn: () => applicationsService.getApplication(appToView!.id),
        enabled: !!appToView?.id,
    });

    const createMutation = useMutation({
        mutationFn: (data: FormData) => applicationsService.createApplication(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Aplikasi berhasil ditambahkan');
            setFormDialogOpen(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Gagal menambahkan aplikasi';
            toast.error(message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ appId, data }: { appId: string; data: FormData }) =>
            applicationsService.updateApplication(appId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Aplikasi berhasil diperbarui');
            setFormDialogOpen(false);
            setAppToEdit(null);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Gagal memperbarui aplikasi';
            toast.error(message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (appId: string) => applicationsService.deleteApplication(appId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Aplikasi berhasil dihapus');
            setConfirmDialogOpen(false);
            setAppToDelete(null);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Gagal menghapus aplikasi';
            toast.error(message);
        },
    });

    useEffect(() => {
        if (appDetailData?.data) {
            setAppToView(appDetailData.data);
        }
    }, [appDetailData]);

    const handleCreate = () => {
        setAppToEdit(null);
        setFormDialogOpen(true);
    };

    const handleEdit = (app: ApplicationListItemResponse) => {
        setAppToEdit(app);
        setFormDialogOpen(true);
    };

    const handleDelete = (app: ApplicationListItemResponse) => {
        setAppToDelete(app);
        setConfirmDialogOpen(true);
    };

    const handleView = (app: ApplicationListItemResponse | ApplicationResponse) => {
        setAppToView(app as ApplicationResponse);
        setDetailDialogOpen(true);
    };

    const handleFormSubmit = (data: FormData) => {
        if (appToEdit) {
            updateMutation.mutate({ appId: appToEdit.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const confirmDelete = () => {
        if (appToDelete) {
            deleteMutation.mutate(appToDelete.id);
        }
    };

    const applications = applicationsData?.data || [];
    const totalItems = applicationsData?.meta?.total_items || 0;
    const currentPage = applicationsData?.meta?.page || 1;
    const itemsPerPage = applicationsData?.meta?.limit || 20;
    const totalPages = applicationsData?.meta?.total_pages || 1;

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Aplikasi</h1>
                    <p className="text-muted-foreground">Kelola aplikasi yang terdaftar dalam sistem</p>
                </div>
                {canCreate && (
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Aplikasi
                    </Button>
                )}
            </div>

            <FilterCard
                searchValue={queryParams.search || ''}
                onSearchChange={(value) => updateURL({ search: value })}
                searchPlaceholder="Cari aplikasi..."
                showSearch={true}
                onClearFilters={resetFilters}
                showClearButton={true}
            >
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={queryParams.status || 'all'}
                        onValueChange={(value) => updateURL({ status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </FilterCard>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Aplikasi</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-muted-foreground">Memuat data aplikasi...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <div className="text-center">
                                <p className="font-semibold">Gagal memuat data</p>
                                <p className="text-sm text-muted-foreground">
                                    {error instanceof Error ? error.message : 'Terjadi kesalahan'}
                                </p>
                            </div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <FolderOpen className="h-16 w-16 text-muted-foreground/50" />
                            <div className="text-center">
                                <p className="font-semibold">Belum ada aplikasi</p>
                                <p className="text-sm text-muted-foreground">
                                    Aplikasi yang ditambahkan akan muncul di sini
                                </p>
                            </div>
                            {canCreate && (
                                <Button onClick={handleCreate} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Aplikasi Pertama
                                </Button>
                            )}
                        </div>
                    ) : isMobileView ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {applications.map((app) => (
                                <ApplicationsCardView
                                    key={app.id}
                                    application={app}
                                    onView={handleView}
                                    onEdit={canUpdate ? handleEdit : undefined}
                                    onDelete={canDelete ? handleDelete : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <ApplicationsTableView
                            applications={applications}
                            onView={handleView}
                            onEdit={canUpdate ? handleEdit : undefined}
                            onDelete={canDelete ? handleDelete : undefined}
                        />
                    )}
                </CardContent>
            </Card>

            {!isLoading && applications.length > 0 && (
                <PaginationCard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page: number) => updateURL({ page })}
                    onItemsPerPageChange={(limit: string) => updateURL({ limit: Number(limit) })}
                />
            )}

            <ApplicationsFormDialog
                open={formDialogOpen}
                onClose={() => {
                    setFormDialogOpen(false);
                    setAppToEdit(null);
                }}
                onSubmit={handleFormSubmit}
                application={appToEdit}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />

            <ApplicationsDetailDialog
                open={detailDialogOpen}
                onClose={() => {
                    setDetailDialogOpen(false);
                    setAppToView(null);
                }}
                application={appToView}
            />

            <ConfirmDialog
                isOpen={confirmDialogOpen}
                onClose={() => {
                    setConfirmDialogOpen(false);
                    setAppToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Aplikasi"
                description={`Apakah Anda yakin ingin menghapus aplikasi "${appToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                isProcessing={deleteMutation.isPending}
            />
        </div>
    );
}

export default Applications;
