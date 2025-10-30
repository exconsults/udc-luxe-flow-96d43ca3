import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, WifiOff, Sparkles, Shield, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import udcLogo from "@/assets/udc-logo.png";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, isOnline } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      alert(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('signupEmail') as string;
    const password = formData.get('signupPassword') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;

    try {
      await signUp(email, password, firstName, lastName, phone);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      alert(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to home</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-4 mb-8">
                  <img src={udcLogo} alt="UDC Logo" className="h-20 w-20 drop-shadow-lg" />
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-white">UDC</span>
                    <span className="text-white/90">Usman Laundry Cleaning</span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to Premium Laundry Care
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Join thousands of satisfied customers who trust us with their clothes and traditional wear.
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span>Same-day delivery for orders by 9 AM</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Shield className="h-5 w-5" />
                    </div>
                    <span>GPS tracking and real-time updates</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span>Eco-friendly care for all garments</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
                  <div>
                    <div className="text-3xl font-bold text-white">500+</div>
                    <div className="text-white/80 text-sm">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">4.9★</div>
                    <div className="text-white/80 text-sm">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-white/80 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div>
            {/* Offline Indicator */}
            {!isOnline && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm animate-fade-in">
                <WifiOff className="h-4 w-4 text-destructive" />
                <span className="text-destructive">You're offline. Sign in with cached credentials or wait to go back online.</span>
              </div>
            )}

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <img src={udcLogo} alt="UDC Logo" className="h-16 w-16" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">UDC</span>
                <span className="text-sm text-muted-foreground">Clean. Fresh. Delivered.</span>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="signin" className="text-base">Sign In</TabsTrigger>
                <TabsTrigger value="signup" disabled={!isOnline} className="text-base">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <Card className="border-2 shadow-xl">
                  <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          placeholder="you@example.com" 
                          required 
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password"
                          name="password"
                          type="password" 
                          placeholder="••••••••" 
                          required 
                          className="h-11"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-base" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <Card className="border-2 shadow-xl">
                  <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Get started with your laundry service today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName"
                            name="firstName"
                            placeholder="John" 
                            required 
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName"
                            name="lastName"
                            placeholder="Doe" 
                            required 
                            className="h-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input 
                          id="signupEmail"
                          name="signupEmail"
                          type="email" 
                          placeholder="you@example.com" 
                          required 
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input 
                          id="signupPassword"
                          name="signupPassword"
                          type="password" 
                          placeholder="••••••••" 
                          required 
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          type="tel" 
                          placeholder="+234 (800) 000-0000" 
                          required 
                          className="h-11"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-base" 
                        disabled={isLoading || !isOnline}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
