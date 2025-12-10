import LoginBranding from './LoginBranding';
import LoginForm from './LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent blur-3xl opacity-60" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-muted blur-3xl opacity-40" />
      </div>

      <div className="lg:hidden absolute top-0 left-0 right-0 h-64 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute top-10 -left-10 w-32 h-32 bg-tertiary/20 rounded-full" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-secondary/20 rounded-full" />
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/15 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-20 w-40 h-40 bg-white/5 rounded-full" />
        {/* <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-tertiary/10 rounded-full" /> */}
        <LoginBranding className="w-full text-white relative z-10" />
      </div>

      <div className="w-full lg:w-[50%] flex items-center justify-center p-6 lg:p-10 pt-40 lg:pt-10 relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
