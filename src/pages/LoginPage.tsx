import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHospitalSettings } from '@/contexts/HospitalSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Lock, Mail, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { settings } = useHospitalSettings();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for better UX feel
    setTimeout(async () => {
      const success = await login(email, password);

      if (success) {
        toast.success('Welcome back!');
        // Navigation is handled by the protected route or the component that called login
        // But we can force a redirect here if needed, though usually AuthContext state change triggers re-render
        // For this demo, we'll manually navigate based on role if needed, but App.tsx handles routing.
        // Let's just navigate to root which will redirect based on role.
        navigate('/');
      } else {
        toast.error('Invalid credentials. Please check your email and password.');
      }
      setLoading(false);
    }, 1000);
  };

  const fillDemoCredentials = (roleEmail: string, rolePassword?: string) => {
    setEmail(roleEmail);
    setPassword(rolePassword || 'password');
    toast.info(`Demo credentials filled for ${roleEmail.split('@')[0]}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col space-y-6 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold tracking-tight">{settings?.hospital_name || 'Hospital HMS'}</span>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive Hospital Management System designed for modern healthcare facilities.
            Streamline patient care, manage resources, and improve clinical outcomes.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <User className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">Secure portals for Doctors, Nurses, and Staff.</p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Secure & Compliant</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security for patient data.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={`name@${settings?.email?.split('@')[1] || 'hospital.com'}`}
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Demo Accounts - Only show in development */}
            {import.meta.env.DEV && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Demo Accounts (Development Only)
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('admin@archmedics.com', 'admin123')}>
                    Admin
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('dr.smith@archmedics.com', 'doctor123')}>
                    Doctor
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('nurse@archmedics.com', 'nurse123')}>
                    Nurse
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('ehr@archmedics.com', 'ehr123')}>
                    EHR
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('labtech@archmedics.com', 'lab123')}>
                    Lab Tech
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
            <p className="text-xs text-muted-foreground text-center">
              Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
