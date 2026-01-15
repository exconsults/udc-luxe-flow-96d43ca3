import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Gift, Star, Users, Copy, CheckCircle, AlertCircle, Share2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pointsEarned: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;
    
    const init = async () => {
      await ensureReferralCode();
      if (isMounted) await loadData();
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  const ensureReferralCode = async () => {
    if (!user) return;
    
    setGeneratingCode(true);
    try {
      const { data, error } = await supabase.rpc('ensure_referral_code');
      if (!error && data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error ensuring referral code:', error);
      setError('Failed to generate referral code. Please refresh the page.');
    } finally {
      setGeneratingCode(false);
    }
  };

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rewardsError) throw rewardsError;

      const { count: referralCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', user.id);

      if (countError) throw countError;

      const { data: referralRewards, error: referralError } = await supabase
        .from('rewards')
        .select('points')
        .eq('user_id', user.id)
        .eq('reason', 'referral');

      if (referralError) throw referralError;

      const totalReferralPoints = referralRewards?.reduce((sum, r) => sum + r.points, 0) || 0;

      setProfile(profileData);
      setRewards(rewardsData || []);
      setReferralStats({
        totalReferrals: referralCount || 0,
        pointsEarned: totalReferralPoints,
      });
    } catch (error: any) {
      console.error('Error loading rewards data:', error);
      setError('Failed to load rewards data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => {
    const code = profile?.referral_code;
    return code ? `https://udc-laundry.vercel.app/?ref=${encodeURIComponent(code)}` : 'https://udc-laundry.vercel.app/';
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopiedLink(true);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(profile?.referral_code || "");
    setCopiedCode(true);
    toast({
      title: "Code Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">Rewards Program</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Earn points with every order and referral</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-2 w-fit">
          <Award className="h-4 w-4 mr-2" />
          {profile?.loyalty_points || 0} Points Available
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Referrals</p>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{referralStats.totalReferrals}</p>
                <p className="text-xs text-muted-foreground mt-1">Friends joined</p>
              </div>
              <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Points Earned</p>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{referralStats.pointsEarned}</p>
                <p className="text-xs text-muted-foreground mt-1">From referrals</p>
              </div>
              <div className="p-3 sm:p-4 bg-accent/10 rounded-2xl">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground pb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Share2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Share & Earn</CardTitle>
              <CardDescription className="text-primary-foreground/80">Invite friends and earn rewards together</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-6 -mt-4">
          {generatingCode ? (
            <div className="space-y-6 pt-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ) : (
            <>
              {/* Referral Code */}
              <div className="bg-card rounded-2xl border-2 border-dashed border-primary/30 p-4 sm:p-6">
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 block">Your Referral Code</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={profile?.referral_code || ""}
                      readOnly
                      className="h-14 text-center text-xl sm:text-2xl font-bold tracking-widest bg-muted/50 border-0"
                      placeholder={loading ? "Loading..." : ""}
                    />
                  </div>
                  <Button 
                    onClick={copyReferralCode} 
                    variant="outline" 
                    size="lg"
                    className="h-14 px-6 gap-2"
                    disabled={!profile?.referral_code || loading}
                  >
                    {copiedCode ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                    {copiedCode ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="space-y-3">
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Or share this link</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={profile?.referral_code ? getReferralLink() : (loading ? "Loading..." : "Generating your referral link...")}
                    readOnly
                    className="h-12 text-sm bg-muted/50 border-0 flex-1"
                  />
                  <Button 
                    onClick={copyReferralLink} 
                    className="h-12 px-6 gap-2"
                    disabled={!profile?.referral_code || loading}
                  >
                    {copiedLink ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* How Referrals Work */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-secondary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            How Referrals Work
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Share Your Code</h4>
              <p className="text-sm text-muted-foreground">
                Send your unique code or link to friends and family
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">They Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                When they create an account with your code, they get <strong>50 bonus points</strong>
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">You Both Win!</h4>
              <p className="text-sm text-muted-foreground">
                You earn <strong>100 reward points</strong> for each successful referral
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-card rounded-xl border border-border/50">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Redeem points for:</p>
                <ul className="text-muted-foreground grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                  <li>• Discounts on orders</li>
                  <li>• Free express delivery</li>
                  <li>• Premium service upgrades</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Ways to Earn */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Other Ways to Earn</CardTitle>
          <CardDescription>More opportunities to accumulate rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 opacity-70">
            <div className="p-3 rounded-xl bg-accent/10">
              <Star className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Complete Orders</h3>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn points with every completed order
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards History */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Rewards History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No Rewards Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start referring friends to earn your first rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{reward.reason}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(reward.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg sm:text-xl font-bold text-primary">+{reward.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redeem Points */}
      <Card className="border-2 border-dashed border-primary/30 shadow-sm">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Redeem Points</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Soon you'll be able to redeem your points for discounts and free services
          </p>
          <Badge variant="outline" className="mt-4">Coming Soon</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for Label since we're using it directly
const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={className} {...props}>{children}</label>
);

export default Rewards;
