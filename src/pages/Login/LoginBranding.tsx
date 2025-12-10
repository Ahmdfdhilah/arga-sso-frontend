import { cn } from '@/lib/utils';
import logoAbi from '@/assets/logo_abi_darkmode.png';

interface LoginBrandingProps {
  className?: string;
}

const LoginBranding: React.FC<LoginBrandingProps> = ({ className }) => {
  return (
    <div className={cn('flex flex-col justify-center p-8 lg:p-12', className)}>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <img src={logoAbi} alt="Arga Bumi Indonesia" className="h-14 w-auto" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
            Akses semua layanan
            <br />
            <span className="text-emerald-200">
              dalam satu login
            </span>
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Masuk sekali untuk mengakses seluruh aplikasi dan layanan Arga Bumi Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm"
              >
                <span className="text-xs font-medium text-white">U{i}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/70">
            <span className="font-semibold text-white">500+</span> pengguna aktif
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <p className="text-xs text-white/50">
          © 2024 Arga Bumi Indonesia. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginBranding;
