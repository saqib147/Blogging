import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import LogoMark from '../components/layout/LogoMark';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || user) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 flex items-center justify-center">
      <div className="w-full grid md:grid-cols-2 rounded-2xl overflow-hidden border border-accent bg-surface/50 shadow-card">

        {/* Left Column (Banner Artwork) */}
        <div className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0D2B2B] via-[#081F1F] to-[#121212]">
          {/* Glow blooms */}
          <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-30%] right-[-30%] w-[120%] h-[120%] rounded-full bg-tertiary/15 blur-[120px] pointer-events-none" />

          {/* Dynamic Curved Ribbon Waves */}
          <div className="absolute inset-0 z-0 opacity-40">
            <svg className="w-full h-full text-primary" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#glow)">
                <path d="M-100 450 C100 300, 200 400, 450 150 C550 50, 400 350, 500 500" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M-50 480 C150 330, 220 430, 480 180" stroke="var(--tertiary)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                <path d="M-150 420 C50 270, 180 370, 420 120" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

                <circle cx="200" cy="300" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
                <circle cx="200" cy="300" r="160" stroke="var(--tertiary)" strokeWidth="1" strokeDasharray="6 12" opacity="0.15" />
                <circle cx="200" cy="300" r="200" stroke="currentColor" strokeWidth="1" opacity="0.1" />
              </g>
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>
          </div>

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              {/* <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0D2B2B] shadow-md ring-1 ring-black/5">
                <LogoMark className="h-5 w-5" />
              </span> */}
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Ink & Echo
              </span>
            </div>
          </div>

          {/* Banner Text */}
          <div className="relative z-10 space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/10 text-white/90 backdrop-blur-sm">
              Maker Community
            </span>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-white tracking-tight">
              Unleash your<br />creative<br />energy.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Join a vibrant network of designers and bold thinkers. Shape the future of expression.
            </p>
          </div>

          {/* Brand stamp */}
          <div className="relative z-10 text-[10px] text-white/40 tracking-wider uppercase font-medium">
            © Ink & Echo Co.
          </div>
        </div>

        {/* Right Column (Credentials Form) */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-surface">
          <div className="my-auto space-y-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-heading mb-1.5 tracking-tight">
                Welcome back
              </h1>
              <p className="text-neutral-body/60 text-sm">
                Enter your details to access your creative workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                label="Email address"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-heading">
                    Password
                  </label>
                  {/* <Link to="#" className="text-xs font-semibold text-tertiary hover:underline">
                    Forgot password?
                  </Link> */}
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface border border-accent rounded-md text-neutral-body placeholder:text-neutral-body/30 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all shadow-sm"
                  required
                />
              </div>

              <Button type="submit" variant="secondary" className="w-full py-3 mt-2 justify-center font-semibold text-sm cursor-pointer" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'} <span className="ml-1.5">→</span>
              </Button>
            </form>



            <p className="text-sm text-neutral-body/60 text-center pt-2">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-neutral-heading font-semibold hover:underline decoration-1 underline-offset-4">
                Create one now
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
