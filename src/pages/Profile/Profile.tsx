import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle, User, Mail, Phone, Camera, Eye, UserCircle, Calendar, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layouts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usersService } from '@/services/users';
import type { UserResponse } from '@/services/users/types';
import { getInitials } from '@/utils';

const profileSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
    phone: z.string().optional(),
    alias: z.string().optional(),
    gender: z.string().optional(),
    date_of_birth: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().max(1000, 'Bio maksimal 1000 karakter').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function Profile() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showFormConfirmDialog, setShowFormConfirmDialog] = useState(false);
    const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
    const [pendingFormData, setPendingFormData] = useState<ProfileFormData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await usersService.getMyProfile();

            if (!response.error && response.data) {
                setUser(response.data);
                reset({
                    name: response.data.name,
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    alias: response.data.alias || '',
                    gender: response.data.gender || '',
                    date_of_birth: response.data.date_of_birth ? response.data.date_of_birth.split('T')[0] : '',
                    address: response.data.address || '',
                    bio: response.data.bio || '',
                });
            }
        } catch (err) {
            console.error('Gagal memuat profil:', err);
            setError('Gagal memuat profil. Silakan refresh halaman.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarClick = () => {
        setShowAvatarDialog(true);
    };

    const handleChangeAvatar = () => {
        setShowAvatarDialog(false);
        fileInputRef.current?.click();
    };

    const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB');
            return;
        }

        // Store file and show preview in confirmation dialog
        setPendingAvatarFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setShowConfirmDialog(true);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmAvatarUpload = async () => {
        if (!pendingAvatarFile) return;

        try {
            setIsUploadingAvatar(true);
            setShowConfirmDialog(false);

            const formData = new FormData();
            if (user?.name) formData.append('name', user.name);
            formData.append('avatar', pendingAvatarFile);

            const response = await usersService.updateMyProfileWithAvatar(formData);

            if (!response.error && response.data) {
                setUser(response.data);
                toast.success('Avatar berhasil diperbarui');
            } else {
                toast.error(response.message || 'Gagal memperbarui avatar');
            }
        } catch (err) {
            console.error('Gagal memperbarui avatar:', err);
            toast.error('Gagal memperbarui avatar. Silakan coba lagi.');
        } finally {
            setIsUploadingAvatar(false);
            setPendingAvatarFile(null);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleCancelAvatarUpload = () => {
        setShowConfirmDialog(false);
        setPendingAvatarFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        // Show confirmation dialog before updating
        setPendingFormData(data);
        setShowFormConfirmDialog(true);
    };

    const handleConfirmFormUpdate = async () => {
        if (!pendingFormData) return;

        try {
            setIsSubmitting(true);
            setShowFormConfirmDialog(false);
            const response = await usersService.updateMyProfile({
                name: pendingFormData.name,
                phone: pendingFormData.phone,
                alias: pendingFormData.alias,
                gender: pendingFormData.gender,
                date_of_birth: pendingFormData.date_of_birth,
                address: pendingFormData.address,
                bio: pendingFormData.bio,
            });

            if (!response.error && response.data) {
                setUser(response.data);
                toast.success('Profil berhasil diperbarui');
            } else {
                toast.error(response.message || 'Gagal memperbarui profil');
            }
        } catch (err) {
            console.error('Gagal memperbarui profil:', err);
            toast.error('Gagal memperbarui profil. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
            setPendingFormData(null);
        }
    };

    const handleCancelFormUpdate = () => {
        setShowFormConfirmDialog(false);
        setPendingFormData(null);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <MainLayout
            userName={user?.name}
            userEmail={user?.email}
            userAvatar={user?.avatar_url}
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground">
                    Profil Saya
                </h2>
                <p className="mt-1 text-muted-foreground">
                    Kelola informasi profil
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    {/* Profile Header Card - Horizontal layout */}
                    <div className="glass-card relative overflow-hidden rounded-2xl bg-primary p-8">
                        {/* Noise texture */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
                        {/* Bubble decorations */}
                        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute bottom-4 left-1/3 h-20 w-20 rounded-full bg-tertiary/20" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar Section - Clickable */}
                            <div className="flex-shrink-0 relative group">
                                <div
                                    onClick={handleAvatarClick}
                                    className="cursor-pointer relative"
                                >
                                    <Avatar className="h-32 w-32 border-4 border-white/20 transition-transform group-hover:scale-105">
                                        <AvatarImage src={user?.avatar_url} alt={user?.name} />
                                        <AvatarFallback className="text-3xl bg-white/20 text-white">
                                            {getInitials(user?.name || 'U')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                    {/* Loading spinner */}
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Info - Main Content */}
                            <div className="flex-1 space-y-6">
                                {/* User Details */}
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                                            {user?.role === 'superadmin' ? 'Super Admin' : user?.role || 'User'}
                                        </span>
                                    </div>
                                    <p className="text-white/70">{user?.email || '-'}</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                                        <p className="text-xs text-white/60 mb-1">Bergabung Sejak</p>
                                        <p className="text-sm font-medium text-white">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : '-'}
                                        </p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                                        <p className="text-xs text-white/60 mb-1">Total Aplikasi</p>
                                        <p className="text-sm font-medium text-white">
                                            {user?.allowed_apps?.length || 0} Aplikasi
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                    />

                    {/* Avatar Dialog */}
                    <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Avatar Profil</DialogTitle>
                                <DialogDescription>
                                    Lihat atau ubah foto profil Anda
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {/* Avatar Preview */}
                                <div className="flex justify-center">
                                    <Avatar className="h-40 w-40 border-4 border-border">
                                        <AvatarImage src={user?.avatar_url} alt={user?.name} />
                                        <AvatarFallback className="text-5xl">
                                            {getInitials(user?.name || 'U')}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(user?.avatar_url, '_blank')}
                                        disabled={!user?.avatar_url}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Detail
                                    </Button>
                                    <Button onClick={handleChangeAvatar}>
                                        <Camera className="mr-2 h-4 w-4" />
                                        Ubah Avatar
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Format: PNG, JPG • Maksimal: 5MB
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Confirm Avatar Upload Dialog */}
                    <ConfirmDialog
                        isOpen={showConfirmDialog}
                        onClose={handleCancelAvatarUpload}
                        onConfirm={handleConfirmAvatarUpload}
                        isProcessing={isUploadingAvatar}
                        title="Konfirmasi Ubah Avatar"
                        description="Avatar yang Anda pilih akan langsung menggantikan avatar profil saat ini. Apakah Anda yakin ingin melanjutkan?"
                        confirmText="Ya, Ubah Avatar"
                        cancelText="Batal"
                        variant="info"
                        icon={<Camera className="h-5 w-5" />}
                    />

                    {/* Confirm Form Update Dialog */}
                    <ConfirmDialog
                        isOpen={showFormConfirmDialog}
                        onClose={handleCancelFormUpdate}
                        onConfirm={handleConfirmFormUpdate}
                        isProcessing={isSubmitting}
                        title="Konfirmasi Perubahan Profil"
                        description={`Apakah Anda yakin ingin mengubah nama menjadi "${pendingFormData?.name}"?`}
                        confirmText="Ya, Simpan"
                        cancelText="Batal"
                        variant="info"
                        icon={<User className="h-5 w-5" />}
                    />

                    {/* Form Section - Full width */}
                    <div className="glass-card relative overflow-hidden rounded-2xl bg-primary p-8">
                        {/* Noise texture */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
                        {/* Bubble decorations */}
                        <div className="absolute top-4 right-6 h-24 w-24 rounded-full bg-white/10" />
                        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-primary/20" />

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-1">
                                    Informasi Personal
                                </h3>
                                <p className="text-sm text-white/70">
                                    Perbarui informasi profil Anda
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white/90 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        {...register('name')}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-300">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        disabled
                                        className="bg-white/5 border-white/10 text-white/60 placeholder:text-white/30 cursor-not-allowed"
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-300">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-white/90 flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        {...register('phone')}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-300">{errors.phone.message}</p>
                                    )}
                                </div>

                                {/* Alias Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="alias" className="text-white/90 flex items-center gap-2">
                                        <UserCircle className="h-4 w-4" />
                                        Nama Panggilan
                                    </Label>
                                    <Input
                                        id="alias"
                                        {...register('alias')}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                                        placeholder="Nama panggilan"
                                    />
                                    {errors.alias && (
                                        <p className="text-sm text-red-300">{errors.alias.message}</p>
                                    )}
                                </div>

                                {/* Gender Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="text-white/90 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Jenis Kelamin
                                    </Label>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/15 focus:border-white/30">
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Laki-laki</SelectItem>
                                                    <SelectItem value="female">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.gender && (
                                        <p className="text-sm text-red-300">{errors.gender.message}</p>
                                    )}
                                </div>

                                {/* Date of Birth Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth" className="text-white/90 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Tanggal Lahir
                                    </Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        {...register('date_of_birth')}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                                    />
                                    {errors.date_of_birth && (
                                        <p className="text-sm text-red-300">{errors.date_of_birth.message}</p>
                                    )}
                                </div>

                                {/* Address Field - Full Width */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address" className="text-white/90 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Alamat
                                    </Label>
                                    <Input
                                        id="address"
                                        {...register('address')}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                                        placeholder="Alamat lengkap"
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-300">{errors.address.message}</p>
                                    )}
                                </div>

                                {/* Bio Field - Full Width */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="bio" className="text-white/90 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Bio
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        {...register('bio')}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30 min-h-[100px]"
                                        placeholder="Ceritakan sedikit tentang diri Anda"
                                        maxLength={1000}
                                    />
                                    {errors.bio && (
                                        <p className="text-sm text-red-300">{errors.bio.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-white text-primary hover:bg-white/90 font-medium"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
