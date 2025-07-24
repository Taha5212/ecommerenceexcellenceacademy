import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackLogin, trackSignup } = useAnalytics();
  const { user } = useAuth();

  const defaultTab = searchParams.get('tab') || 'login';

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Password validation rules
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('One special character');
    }
    
    // Common weak passwords
    const weakPasswords = [
      'password', 'password1', 'password123', '123456', '123456789',
      'qwerty', 'abc123', 'admin', 'letmein', 'welcome', 'Welcome1',
      'Password1', 'Password123'
    ];
    
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }
    
    return errors;
  };

  useEffect(() => {
    if (password) {
      setPasswordErrors(validatePassword(password));
    } else {
      setPasswordErrors([]);
    }
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      trackLogin('email');
      toast({
        title: "Welcome back!",
        description: "Redirecting to dashboard...",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }

      // Validate password strength
      const errors = validatePassword(password);
      if (errors.length > 0) {
        toast({
          title: "Password Requirements Not Met",
          description: "Please fix the password requirements below",
          variant: "destructive"
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      trackSignup('email');
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? 'text-green-500' : 'text-red-500'}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-premium border-0 bg-white/95 backdrop-blur-md rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-brand-blue">
            Ecommerence Excellence Academy
          </CardTitle>
          <CardDescription>
            Access your learning journey
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {password && (
                    <div className="space-y-1 p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Password Requirements:</p>
                      <PasswordRequirement met={password.length >= 8} text="At least 8 characters" />
                      <PasswordRequirement met={/[A-Z]/.test(password)} text="One uppercase letter" />
                      <PasswordRequirement met={/[a-z]/.test(password)} text="One lowercase letter" />
                      <PasswordRequirement met={/\d/.test(password)} text="One number" />
                      <PasswordRequirement met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)} text="One special character" />
                      <PasswordRequirement met={!['password', 'password1', 'password123', '123456', '123456789', 'qwerty', 'abc123', 'admin', 'letmein', 'welcome'].includes(password.toLowerCase())} text="Not a common password" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                  disabled={loading || passwordErrors.length > 0 || password !== confirmPassword}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};