import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { ApplicationCard } from '@/components/dashboard/ApplicationCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usersService } from '@/services/users';
import { applicationsService } from '@/services/applications';
import type { UserResponse } from '@/services/users/types';
import type { AllowedAppResponse } from '@/services/applications/types';
import { getInitials, getDayName, getFormattedDate, getFormattedTime } from '@/utils';
import logoKecil from '@/assets/logo_abi_lightmode.png';

export function Dashboard() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [applications, setApplications] = useState<AllowedAppResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadDashboardData();

        // Update clock every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [userResponse, appsResponse] = await Promise.all([
                usersService.getMyProfile(),
                applicationsService.getMyApplications(),
            ]);

            if (!userResponse.error && userResponse.data) {
                setUser(userResponse.data);
            }

            if (!appsResponse.error && appsResponse.data) {
                setApplications(appsResponse.data);
            }
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
            setError('Gagal memuat data dashboard. Silakan refresh halaman.');
        } finally {
            setIsLoading(false);
        }
    };



    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <img src={logoKecil} alt="Arga Bumi Indonesia" className="h-10 w-auto" />
                    </div>

                    <div className="flex flex-1 items-center justify-center px-8">
                    </div>

                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-primary/20">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                {user ? getInitials(user.name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Welcome Message */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-foreground">
                        Selamat Datang, {user?.name || 'User'}!
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Kelola akses aplikasi Anda dengan mudah
                    </p>
                </div>

                {/* Top Info Row - Date, Weather, Clock */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    {/* Date Widget */}
                    <div className="glass-card rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Hari Ini</p>
                                <p className="text-xl font-bold text-foreground">{getDayName(currentTime)}</p>
                                <p className="text-sm text-muted-foreground">{getFormattedDate(currentTime)}</p>
                            </div>
                        </div>
                    </div>


                    {/* Member Since Widget */}
                    <div className="glass-card rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-secondary/10 p-3">
                                <Calendar className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Bergabung sejak</p>
                                <p className="text-xl font-bold text-foreground">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : '-'}
                                </p>
                                <p className="text-sm text-muted-foreground">Sebagai Argarians</p>
                            </div>
                        </div>
                    </div>


                    {/* Clock Widget */}
                    <div className="glass-card rounded-2xl bg-gradient-to-br from-tertiary/5 to-tertiary/10 p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-tertiary/10 p-3">
                                <Clock className="h-6 w-6 text-tertiary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Waktu</p>
                                <p className="text-2xl font-bold font-mono text-foreground">{getFormattedTime(currentTime)}</p>
                                <p className="text-sm text-muted-foreground">WIB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Grid */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">Aplikasi Anda</h3>
                            <p className="text-sm text-muted-foreground">{applications.length} aplikasi tersedia</p>
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <div className="glass-card rounded-xl border border-dashed border-border p-12 text-center">
                            <p className="text-muted-foreground">
                                Tidak ada aplikasi yang tersedia untuk Anda saat ini.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {applications.map((app) => (
                                <ApplicationCard key={app.id} app={app} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
