import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, TrendingUp, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pointsEarned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      // Load profile with referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profile) {
        setReferralCode(profile.referral_code || "");
      }

      // Count referrals
      const { count: referralCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', user.id);

      // Get referral rewards
      const { data: rewards } = await supabase
        .from('rewards')
        .select('points')
        .eq('user_id', user.id)
        .eq('reason', 'referral');

      const totalPoints = rewards?.reduce((sum, r) => sum + r.points, 0) || 0;

      setReferralStats({
        totalReferrals: referralCount || 0,
        pointsEarned: totalPoints,
      });
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => {
    return `${window.location.origin}/auth?ref=${referralCode}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
        <p className="text-muted-foreground">Invite friends and earn rewards together!</p>
      </div>

      {/* Stats */}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Points Earned</CardTitle>
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

      {/* Referral Code Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code or link with friends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Referral Code</label>
            <div className="flex gap-2">
              <Input
                value={referralCode}
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

      {/* How It Works */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            How Referrals Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Referrals;