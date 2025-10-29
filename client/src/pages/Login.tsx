import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }

    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      showToast(error.message || 'Failed to sign in', 'error');
    } else {
      showToast('Welcome back!', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center p-4 bg-gradient-to-br from-violet-700 via-fuchsia-600 to-purple-700">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left hero copy */}
        <div className="text-white">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow">Welcome Back!</h1>
          <p className="text-white/90 text-lg mb-6 max-w-xl">Ready to continue your hackathon journey? Sign in to access your dashboard.</p>
          <ul className="space-y-2 text-white/90 text-sm list-disc pl-5">
            <li>Find your perfect team</li>
            <li>Join exciting hackathons</li>
            <li>Showcase your skills</li>
          </ul>
        </div>

        {/* Right glass card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-3">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-white/80 text-sm">Access your HackMate account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:opacity-95 focus:ring-4 focus:ring-fuchsia-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white underline font-medium hover:text-white/90 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
