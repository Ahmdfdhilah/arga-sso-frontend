import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { getDeviceInfo, getDeviceId } from '@/lib/device';
import logoKecil from '@/assets/logo-lightmode-kecil.png';

const GoogleCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const setTokens = useAuthStore((state) => state.setTokens);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError('Login dengan Google dibatalkan atau gagal.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            if (!code) {
                setError('Kode otorisasi tidak ditemukan.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                const deviceInfo = getDeviceInfo();
                const deviceId = getDeviceId();

                // Include device_id in device_info for backend
                const deviceInfoWithId = {
                    ...deviceInfo,
                    device_id: deviceId,
                };

                // Redirect URI harus sama persis dengan yang dikirim saat authorization
                const redirectUri = `${window.location.origin}/auth/google/callback`;

                const response = await authService.googleCallback(
                    code,
                    redirectUri,
                    undefined, // client_id - SSO only untuk frontend utama
                    undefined, // fcm_token
                    JSON.stringify(deviceInfoWithId)
                );

                if (response.error) {
                    setError(response.message || 'Login gagal');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                const { access_token, refresh_token, sso_token, user } = response.data;

                // Validate required tokens
                if (!access_token || !refresh_token) {
                    setError('Token tidak valid dari server.');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                // Simpan tokens
                setTokens(access_token, refresh_token, sso_token);

                // Simpan user data
                if (user) {
                    setUser({
                        id: user.id,
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        avatar_url: user.avatar_url,
                        allowed_apps: user.allowed_apps || [],
                    });
                }

                // Redirect ke dashboard
                navigate('/dashboard');
            } catch (err) {
                console.error('Google callback error:', err);
                setError('Terjadi kesalahan saat memproses login.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate, setTokens, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <img src={logoKecil} alt="Arga Bumi Indonesia" className="h-16 w-auto mx-auto" />

                {error ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-destructive">
                            <FcGoogle className="h-6 w-6" />
                            <span className="text-lg font-medium">{error}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">Mengalihkan ke halaman login...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <FcGoogle className="h-8 w-8" />
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                        <p className="text-muted-foreground">Memproses login dengan Google...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleCallback;
