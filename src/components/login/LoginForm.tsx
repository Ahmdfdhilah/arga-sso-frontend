import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useLoginEmail } from '@/hooks/tanstackHooks';
import { authService } from '@/services/auth';
import logoKecil from '@/assets/logo-lightmode-kecil.png';

interface LoginFormProps {
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const loginMutation = useLoginEmail();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate('/dashboard');
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Redirect ke frontend callback, bukan backend
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const response = await authService.getGoogleAuthUrl(redirectUri);
      window.location.href = response.data.auth_url;
    } catch {
      setGoogleLoading(false);
    }
  };

  const isLoading = loginMutation.isPending || googleLoading;

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-background border border-border rounded-2xl p-8 shadow-xl">
        <div className="space-y-2 text-center mb-8">
          <div className="lg:hidden flex justify-center mb-4">
            <img src={logoKecil} alt="Arga Bumi Indonesia" className="h-14 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-card-foreground">Selamat Datang</h2>
          <p className="text-muted-foreground">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10 pr-10 h-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 font-semibold shadow-lg"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground font-medium">atau lanjutkan dengan</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-12 font-medium"
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menghubungkan...
            </>
          ) : (
            <>
              <FcGoogle className="mr-2 h-5 w-5" />
              Masuk dengan Google
            </>
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Dengan masuk, Anda menyetujui{' '}
          <Link to="/privacy-policy" className="text-primary hover:text-primary/80 font-medium">
            Kebijakan Privasi
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground lg:hidden">
        © 2024 Arga Bumi Indonesia
      </p>
    </div>
  );
};

export default LoginForm;
