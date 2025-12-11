import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layouts';
import { ApplicationCard } from '@/components/dashboard/ApplicationCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usersService } from '@/services/users';
import { applicationsService } from '@/services/applications';
import type { UserResponse } from '@/services/users/types';
import type { AllowedAppResponse } from '@/services/applications/types';
import { getDayName, getFormattedDate, getFormattedTime } from '@/utils';

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
        <MainLayout
            userName={user?.name}
            userEmail={user?.email}
            userAvatar={user?.avatar_url}
        >
            {/* Welcome Message */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground">
                    Selamat Datang, {user?.name || 'User'}!
                </h2>
                <p className="mt-1 text-muted-foreground">
                   Di Portal SSO PT. Arga Bumi Indonesia
                </p>
            </div>

            {/* Top Info Row - Date, Weather, Clock */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
                {/* Date Widget */}
                <div className="glass-card relative overflow-hidden rounded-2xl bg-primary p-6">
                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
                    {/* Bubble decorations */}
                    <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-tertiary/20" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="rounded-xl bg-white/20 p-3">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Hari Ini</p>
                            <p className="text-xl font-bold text-white">{getDayName(currentTime)}</p>
                            <p className="text-sm text-white/70">{getFormattedDate(currentTime)}</p>
                        </div>
                    </div>
                </div>

                {/* Member Since Widget */}
                <div className="glass-card relative overflow-hidden rounded-2xl bg-secondary p-6">
                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
                    {/* Bubble decorations */}
                    <div className="absolute top-4 right-6 h-20 w-20 rounded-full bg-white/10" />
                    <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-primary/20" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="rounded-xl bg-white/20 p-3">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Bergabung sejak</p>
                            <p className="text-xl font-bold text-white">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : '-'}
                            </p>
                            <p className="text-sm text-white/70">Sebagai Argarians</p>
                        </div>
                    </div>
                </div>

                {/* Clock Widget */}
                <div className="glass-card relative overflow-hidden rounded-2xl bg-tertiary p-6">
                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
                    {/* Bubble decorations */}
                    <div className="absolute -top-8 right-8 h-28 w-28 rounded-full bg-white/10" />
                    <div className="absolute bottom-6 -left-4 h-14 w-14 rounded-full bg-secondary/20" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="rounded-xl bg-white/20 p-3">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Waktu</p>
                            <p className="text-2xl font-bold font-mono text-white">{getFormattedTime(currentTime)}</p>
                            <p className="text-sm text-white/70">WIB</p>
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
        </MainLayout>
    );
}
