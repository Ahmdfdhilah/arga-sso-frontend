import { cn } from '@/lib/utils';
import { HiCheck } from 'react-icons/hi';
import logoAbi from '@/assets/logo_abi_darkmode.png';

interface LoginBrandingProps {
  className?: string;
}

const features = [
  'Satu akun untuk semua aplikasi',
  'Login aman dengan enkripsi',
  'Akses dari mana saja',
  'Manajemen sesi terpusat',
];

const LoginBranding: React.FC<LoginBrandingProps> = ({ className }) => {
  return (
    <div className={cn('flex flex-col justify-center h-full px-12 xl:px-20', className)}>
      <div className="space-y-10 max-w-lg">
        <div>
          <img src={logoAbi} alt="Arga Bumi Indonesia" className="h-16 xl:h-20 w-auto" />
        </div>

        <div className="space-y-5">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Akses semua layanan
            <br />
            <span className="text-emerald-200">
              dalam satu login
            </span>
          </h2>
          <p className="text-white/80 text-lg xl:text-xl">
            Masuk sekali untuk mengakses seluruh aplikasi dan layanan Arga Bumi Indonesia.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-7 w-7 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                <HiCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <span className="text-white/90 text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-12 xl:left-20">
        <p className="text-sm text-white/50">
          © 2024 Arga Bumi Indonesia. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginBranding;
