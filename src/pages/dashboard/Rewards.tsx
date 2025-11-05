import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, TrendingUp, Gift, Star, Users, Copy, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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

  useEffect(() => {
    if (user) {
      loadData();
      ensureReferralCode();
    }
  }, [user]);

  const ensureReferralCode = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('ensure_referral_code');
      if (!error && data) {
        // Reload profile to get the new code
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
    }
  };

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // Load reward history
    const { data: rewardsData } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Count referrals
    const { count: referralCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', user.id);

    // Get referral rewards
    const { data: referralRewards } = await supabase
      .from('rewards')
      .select('points')
      .eq('user_id', user.id)
      .eq('reason', 'referral');

    const totalReferralPoints = referralRewards?.reduce((sum, r) => sum + r.points, 0) || 0;

    setProfile(profileData);
    setRewards(rewardsData || []);
    setReferralStats({
      totalReferrals: referralCount || 0,
      pointsEarned: totalReferralPoints,
    });
    setLoading(false);
  };

  const getReferralLink = () => {
    return `https://udc-laundry.vercel.app/?ref=${profile?.referral_code}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(profile?.referral_code || "");
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const totalEarned = rewards.reduce((sum, r) => sum + r.points, 0);
  const currentPoints = profile?.loyalty_points || 0;
  const pointsRedeemed = totalEarned - currentPoints;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Rewards Program</h1>
        <p className="text-muted-foreground">Earn points with every order and referral</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-foreground">{referralStats.totalReferrals}</div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-accent/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referral Points Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-foreground">{referralStats.pointsEarned}</div>
              <div className="p-3 bg-accent/10 rounded-full">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-primary">{currentPoints}</div>
              <Award className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{totalEarned}</div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Points Redeemed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{pointsRedeemed}</div>
              <Gift className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code or link with friends to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Referral Code</label>
            <div className="flex gap-2">
              <Input
                value={profile?.referral_code || ""}
                readOnly
                className="font-mono text-lg font-bold"
              />
              <Button onClick={copyReferralCode} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Referral Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Referral Link</label>
            <div className="flex gap-2">
              <Input
                value={getReferralLink()}
                readOnly
                className="text-sm"
              />
              <Button onClick={copyReferralLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            How Referrals Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Share Your Code</h4>
                <p className="text-sm text-muted-foreground">
                  Send your unique referral code or link to friends and family.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">They Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  When they create an account using your code, they get 50 bonus points!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">You Both Win!</h4>
                <p className="text-sm text-muted-foreground">
                  You earn 100 reward points for each successful referral, and they get 50 points to start!
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Reward points can be redeemed for:</p>
                <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Discounts on future orders</li>
                  <li>Free express delivery</li>
                  <li>Premium service upgrades</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Earning Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Other Ways to Earn</CardTitle>
          <CardDescription>More opportunities to accumulate rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            <div className="flex items-start gap-4 p-4 rounded-lg border border-border opacity-60">
              <div className="p-3 rounded-lg bg-accent/10">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Complete Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Earn points with every completed order <span className="text-xs">(Coming Soon)</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards History */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground animate-pulse" />
            </div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No rewards earned yet. Start referring friends to earn your first rewards!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{reward.reason}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(reward.created_at).toLocaleDateString()} at{' '}
                        {new Date(reward.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">+{reward.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redeem Points (Coming Soon) */}
      <Card className="border-dashed border-2">
        <CardContent className="py-12 text-center">
          <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Redeem Points</h3>
          <p className="text-muted-foreground">
            Soon you'll be able to redeem your points for discounts and free services
          </p>
          <p className="text-sm text-muted-foreground mt-2">Coming Soon</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
