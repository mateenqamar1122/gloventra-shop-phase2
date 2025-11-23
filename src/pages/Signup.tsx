import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Mock signup - replace with actual API call
      // const response = await api.post('/auth/signup', { name, email, password, userType });
      // localStorage.setItem('token', response.data.token);
      
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('userType', userType);
        toast.success(`${userType === 'seller' ? 'Seller' : 'Buyer'} account created successfully!`);
        navigate(userType === 'seller' ? '/seller-dashboard' : '/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-hero rounded-xl"></div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join Gloventra today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="mt-1 rounded-xl"
            />
          </div>

          {/* User Type Selection */}
          <div>
            <Label className="text-base font-medium">I want to signup as</Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  userType === 'buyer' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setUserType('buyer')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    userType === 'buyer' 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {userType === 'buyer' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">🛍️ Buyer</div>
                    <div className="text-sm text-muted-foreground">Shop and purchase products</div>
                  </div>
                </div>
              </div>

              <div
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  userType === 'seller' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setUserType('seller')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    userType === 'seller' 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {userType === 'seller' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">🏪 Seller</div>
                    <div className="text-sm text-muted-foreground">Sell products and manage store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-1 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Business customer?{' '}
              <Link to="/b2b-register" className="text-primary hover:underline font-semibold">
                Register for B2B Account
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
