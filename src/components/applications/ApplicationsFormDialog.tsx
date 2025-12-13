import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload } from 'lucide-react';
import type { ApplicationListItemResponse } from '@/services/applications/types';

const applicationFormSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(255, 'Nama maksimal 255 karakter'),
    code: z.string().min(2, 'Code minimal 2 karakter').max(100, 'Code maksimal 100 karakter')
        .regex(/^[a-z0-9_-]+$/, 'Code harus lowercase, angka, underscore, atau dash'),
    base_url: z.string().url('Format URL tidak valid').min(1, 'Base URL harus diisi'),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
    single_session: z.boolean().optional(),
});

type ApplicationFormData = z.infer<typeof applicationFormSchema>;

interface ApplicationsFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    application?: ApplicationListItemResponse | null;
    isSubmitting?: boolean;
}

export function ApplicationsFormDialog({
    open,
    onClose,
    onSubmit,
    application,
    isSubmitting = false,
}: ApplicationsFormDialogProps) {
    const isEditMode = !!application;
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const imgFileRef = useRef<File | null>(null);
    const iconFileRef = useRef<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationFormSchema),
        defaultValues: {
            name: '',
            code: '',
            base_url: '',
            description: '',
            is_active: true,
            single_session: false,
        },
    });

    const isActive = watch('is_active');
    const singleSession = watch('single_session');

    useEffect(() => {
        if (open && application) {
            reset({
                name: application.name || '',
                code: application.code || '',
                base_url: application.base_url || '',
                description: application.description || '',
                is_active: application.is_active,
                single_session: application.single_session,
            });
            setImgPreview(application.img_url || null);
            setIconPreview(application.icon_url || null);
        } else if (!open) {
            reset();
            setImgPreview(null);
            setIconPreview(null);
            imgFileRef.current = null;
            iconFileRef.current = null;
        }
    }, [open, application, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'img' | 'icon') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'img') {
                    setImgPreview(reader.result as string);
                    imgFileRef.current = file;
                } else {
                    setIconPreview(reader.result as string);
                    iconFileRef.current = file;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (data: ApplicationFormData) => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('code', data.code);
        formData.append('base_url', data.base_url);

        if (data.description) {
            formData.append('description', data.description);
        }

        if (isEditMode) {
            formData.append('is_active', String(data.is_active));
        }

        formData.append('single_session', String(data.single_session));

        if (imgFileRef.current) {
            formData.append('img', imgFileRef.current);
        }

        if (iconFileRef.current) {
            formData.append('icon', iconFileRef.current);
        }

        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Aplikasi' : 'Tambah Aplikasi'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Aplikasi *</Label>
                        <Input id="name" {...register('name')} placeholder="Nama aplikasi" />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Kode Aplikasi *</Label>
                            <Input
                                id="code"
                                {...register('code')}
                                placeholder="app-code"
                                disabled={isEditMode}
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="base_url">Base URL *</Label>
                            <Input id="base_url" {...register('base_url')} placeholder="https://example.com" />
                            {errors.base_url && <p className="text-sm text-destructive">{errors.base_url.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Deskripsi aplikasi"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Image (Banner)</Label>
                            <div className="space-y-2">
                                {imgPreview && (
                                    <div className="relative">
                                        <img src={imgPreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="img-upload" className="cursor-pointer">
                                        <div className="flex items-center gap-2 border rounded px-3 py-2 hover:bg-accent">
                                            <Upload className="h-4 w-4" />
                                            <span className="text-sm">{imgPreview ? 'Re-upload Image' : 'Upload Image'}</span>
                                        </div>
                                    </label>
                                    <input
                                        id="img-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, 'img')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <div className="space-y-2">
                                {iconPreview && (
                                    <div className="relative w-32">
                                        <img src={iconPreview} alt="Icon Preview" className="w-32 h-32 object-cover rounded" />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="icon-upload" className="cursor-pointer">
                                        <div className="flex items-center gap-2 border rounded px-3 py-2 hover:bg-accent">
                                            <Upload className="h-4 w-4" />
                                            <span className="text-sm">{iconPreview ? 'Re-upload Icon' : 'Upload Icon'}</span>
                                        </div>
                                    </label>
                                    <input
                                        id="icon-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, 'icon')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {isEditMode && (
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label htmlFor="is_active">Status Active</Label>
                                    <p className="text-sm text-muted-foreground">Aktifkan aplikasi ini</p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={isActive}
                                    onCheckedChange={(checked) => setValue('is_active', checked)}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <Label htmlFor="single_session">Single Session</Label>
                                <p className="text-sm text-muted-foreground">Satu sesi per user</p>
                            </div>
                            <Switch
                                id="single_session"
                                checked={singleSession}
                                onCheckedChange={(checked) => setValue('single_session', checked)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditMode ? 'Simpan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ApplicationsFormDialog;
