import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { UserListItemResponse, UserCreateRequest, UserUpdateRequest } from '@/services/users/types';
import { UserRole, UserStatus } from '@/services/users/types';

const userFormSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    email: z.string().email('Format email tidak valid').min(1, 'Email harus diisi'),
    phone: z.string().min(1, 'Phone harus diisi'),
    alias: z.string().optional().or(z.literal('')),
    gender: z.enum(['male', 'female', '']).optional(),
    role: z.string(),
    status: z.string(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UsersFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserListItemResponse | null;
    onSubmit: (data: UserCreateRequest | UserUpdateRequest) => void;
    isSubmitting: boolean;
}

export function UsersFormDialog({
    open,
    onOpenChange,
    user,
    onSubmit,
    isSubmitting,
}: UsersFormDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            alias: '',
            gender: '',
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email || '',
                phone: user.phone || '',
                alias: user.alias || '',
                gender: (user.gender as 'male' | 'female' | '') || '',
                role: user.role,
                status: user.status,
            });
        } else {
            reset({
                name: '',
                email: '',
                phone: '',
                alias: '',
                gender: '',
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
            });
        }
    }, [user, reset]);

    const handleFormSubmit = (data: UserFormData) => {
        const submitData = {
            name: data.name,
            email: data.email || undefined,
            phone: data.phone || undefined,
            alias: data.alias || undefined,
            gender: data.gender || undefined,
            role: data.role as typeof UserRole[keyof typeof UserRole],
            status: data.status as typeof UserStatus[keyof typeof UserStatus],
        };
        onSubmit(submitData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit User' : 'Tambah User'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Ubah informasi user' : 'Tambahkan user baru ke sistem'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input id="name" {...register('name')} placeholder="Masukkan nama lengkap" />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input id="phone" {...register('phone')} placeholder="08xxxxxxxxxx" />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="alias">Alias</Label>
                            <Input id="alias" {...register('alias')} placeholder="Nama panggilan" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Laki-laki</SelectItem>
                                            <SelectItem value="female">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UserRole.USER}>User</SelectItem>
                                            <SelectItem value={UserRole.GUEST}>Guest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                                            <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                                            <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {user ? 'Simpan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UsersFormDialog;
