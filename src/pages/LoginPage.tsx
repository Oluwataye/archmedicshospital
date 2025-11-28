
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password);
      
      if (success) {
        // Redirect based on user role
        if (email === 'admin@archmedics.com') {
          navigate('/dashboard');
        } else if (email === 'doctor@archmedics.com') {
          navigate('/dashboard');
        } else if (email === 'nurse@archmedics.com') {
          navigate('/nurse');
        } else if (email === 'pharmacist@archmedics.com') {
          navigate('/pharmacy');
        } else if (email === 'labtech@archmedics.com') {
          navigate('/lab');
        } else if (email === 'cashier@archmedics.com') {
          navigate('/cashier');
        } else if (email === 'ehr@archmedics.com') {
          navigate('/ehr');
        }
        
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-medical-primary flex items-center justify-center text-white text-2xl font-bold">
            A
          </div>
          <h1 className="mt-4 text-3xl font-bold">ARCHMEDICS HMS</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Password reset functionality would go here.');
                    }}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-center">
                <div className="text-gray-500">
                  <strong>EHR Manager:</strong> ehr@archmedics.com / ehr123
                </div>
                <div className="text-gray-500">
                  <strong>Doctor:</strong> doctor@archmedics.com / doctor123
                </div>
                <div className="text-gray-500">
                  <strong>Lab Tech:</strong> labtech@archmedics.com / labtech123
                </div>
                <div className="text-gray-500">
                  <strong>Cashier:</strong> cashier@archmedics.com / cashier123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
