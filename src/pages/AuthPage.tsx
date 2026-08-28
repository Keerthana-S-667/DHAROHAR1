import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle,
  Sparkles,
  UserCheck,
  BookOpen,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface AuthPageProps {
  mode: 'traveller' | 'researcher' | 'admin' | 'forgot-password' | 'reset-password';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth Store bindings
  const { login, signup, sendPasswordReset, updatePassword, error, clearError, loading, user } = useAuthStore();

  // Form toggles and fields
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  
  // Custom states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Clear errors when mode changes
  useEffect(() => {
    clearError();
    setValidationError(null);
    setSuccessMessage(null);
    // Reset inputs
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setUsername('');
  }, [mode, isSignUp]);

  // Read URL search params for redirects
  const queryParams = new URLSearchParams(location.search);
  const redirectParam = queryParams.get('redirect');

  // Verify internal redirect path
  const getSafeRedirectPath = (defaultPath: string): string => {
    if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      return redirectParam;
    }
    return defaultPath;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Common validations
    if (!email && mode !== 'reset-password') {
      setValidationError('Please enter your email address.');
      return;
    }

    if (mode === 'forgot-password') {
      try {
        await sendPasswordReset(email);
        setEmailSent(true);
        setSuccessMessage('Password reset link has been sent to your email.');
      } catch (err: any) {
        // Error is set in store
      }
      return;
    }

    if (mode === 'reset-password') {
      if (!password) {
        setValidationError('Please enter a new password.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      try {
        await updatePassword(password);
        setPasswordUpdated(true);
        setSuccessMessage('Password reset successful. You can now log in.');
      } catch (err) {}
      return;
    }

    // Login or Signup
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    if (isSignUp) {
      if (!fullName) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (!username) {
        setValidationError('Please choose a username.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }

      try {
        const res = await signup(
          email,
          password,
          fullName,
          username,
          mode as 'traveller' | 'researcher'
        );

        if (res && res.user && !res.session) {
          // Email confirmation is required
          setSuccessMessage('Your account has been created. Please check your email to verify your account.');
        } else {
          // Registered and automatically logged in
          const path = getSafeRedirectPath(mode === 'traveller' ? '/traveller' : '/research');
          navigate(path);
        }
      } catch (err) {}
    } else {
      // Sign In
      try {
        const res = await login(email, password);
        if (res) {
          // Check role alignment
          const defaultPath = res.profile.role === 'admin' ? '/admin' : (res.profile.role === 'researcher' ? '/research' : '/traveller');
          const path = getSafeRedirectPath(defaultPath);
          navigate(path);
        }
      } catch (err) {}
    }
  };

  // UI labels based on role mode
  const getModeTitle = () => {
    switch (mode) {
      case 'traveller':
        return isSignUp ? 'Begin Traveller Journey' : 'Traveller Portal';
      case 'researcher':
        return isSignUp ? 'Begin Research Journey' : 'Student & Researcher';
      case 'admin':
        return 'Heritage Administration';
      case 'forgot-password':
        return 'Restore Heritage Credentials';
      case 'reset-password':
        return 'Update Heritage Credentials';
      default:
        return 'Dharohar Portal';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'traveller':
        return <UserCheck className="w-5 h-5 text-[#b65a3a]" />;
      case 'researcher':
        return <BookOpen className="w-5 h-5 text-[#b65a3a]" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-[#b65a3a]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#b65a3a]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] stone-pattern flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand logo in Samarkan */}
        <Link to="/" className="inline-block mb-3 brand-wordmark hover:opacity-80 transition-opacity select-none">
          dharohar
        </Link>
        <div className="flex items-center justify-center gap-2 mb-2">
          {getModeIcon()}
          <h2 className="text-2xl font-bold font-display text-[#4b2f23] tracking-wide">
            {getModeTitle()}
          </h2>
        </div>
        <p className="text-xs text-[#4b2f23]/60 max-w-sm mx-auto uppercase tracking-widest font-semibold">
          {mode === 'admin' 
            ? 'Access restricted to authorized personnel' 
            : isSignUp 
              ? 'Join our live archives and logs' 
              : 'Sign in to access your logs'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#ede3d1]/90 backdrop-blur-md py-8 px-6 sm:px-10 border border-[#d5b990]/80 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Subtle gold design overlay */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#b65a3a] to-transparent" />

          {/* Success State */}
          {successMessage ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#4b2f23]">Success</h3>
                <p className="text-xs text-[#4b2f23]/80 leading-relaxed">
                  {successMessage}
                </p>
              </div>
              {passwordUpdated ? (
                <button
                  onClick={() => navigate(mode === 'admin' ? '/admin/login' : `/auth/${mode}`)}
                  className="w-full py-2.5 rounded bg-[#4b2f23] hover:bg-[#b65a3a] text-[#f5f0e6] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Go to Sign In
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 rounded bg-[#4b2f23] hover:bg-[#b65a3a] text-[#f5f0e6] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              )}
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              {/* Errors container */}
              {(error || validationError) && (
                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-800 text-xs flex gap-2.5 items-start">
                  <ShieldAlert className="w-4 h-4 text-[#b65a3a] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">
                    {validationError || error}
                  </span>
                </div>
              )}

              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="full-name" className="block text-[11px] font-bold text-[#4b2f23]/80 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4b2f23]/40">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        id="full-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6]/50 text-[#4b2f23] text-xs font-semibold focus:outline-none focus:border-[#b65a3a] focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-[11px] font-bold text-[#4b2f23]/80 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4b2f23]/40">
                        <span className="text-[11px] font-extrabold">@</span>
                      </div>
                      <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6]/50 text-[#4b2f23] text-xs font-semibold focus:outline-none focus:border-[#b65a3a] focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email (not for password reset) */}
              {mode !== 'reset-password' && (
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold text-[#4b2f23]/80 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4b2f23]/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6]/50 text-[#4b2f23] text-xs font-semibold focus:outline-none focus:border-[#b65a3a] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-[11px] font-bold text-[#4b2f23]/80 uppercase tracking-wider">
                      {mode === 'reset-password' ? 'New Password' : 'Password'}
                    </label>
                    {!isSignUp && mode !== 'reset-password' && (
                      <Link
                        to="/auth/forgot-password"
                        className="text-[10px] font-bold text-[#b65a3a] hover:text-[#4b2f23] uppercase tracking-wider transition-colors"
                      >
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4b2f23]/40">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6]/50 text-[#4b2f23] text-xs font-semibold focus:outline-none focus:border-[#b65a3a] focus:bg-white transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4b2f23]/40 hover:text-[#b65a3a] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (for SignUp or ResetPassword) */}
              {(isSignUp || mode === 'reset-password') && (
                <div>
                  <label htmlFor="confirm-password" className="block text-[11px] font-bold text-[#4b2f23]/80 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4b2f23]/40">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6]/50 text-[#4b2f23] text-xs font-semibold focus:outline-none focus:border-[#b65a3a] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded bg-[#b65a3a] hover:bg-[#4b2f23] text-white font-bold text-xs uppercase tracking-widest hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : mode === 'forgot-password' ? (
                    'Send Reset Link'
                  ) : mode === 'reset-password' ? (
                    'Reset Password'
                  ) : isSignUp ? (
                    'Create Account'
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Toggle Login/Signup links */}
              {mode !== 'admin' && mode !== 'forgot-password' && mode !== 'reset-password' && (
                <div className="text-center pt-3 border-t border-[#d5b990]/40 text-xs">
                  <span className="text-[#4b2f23]/60">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-bold text-[#b65a3a] hover:text-[#4b2f23] transition-colors cursor-pointer"
                  >
                    {isSignUp ? 'Sign In Here' : 'Create One Here'}
                  </button>
                </div>
              )}

              {/* Back to Home action */}
              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4b2f23]/60 hover:text-[#b65a3a] uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Home
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
