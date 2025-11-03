import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Gift, Star, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Rewards = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Load reward history
    const { data: rewardsData } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setProfile(profileData);
    setRewards(rewardsData || []);
    setLoading(false);
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

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
          <CardDescription>Multiple ways to accumulate rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Refer Friends</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Earn <strong className="text-primary">100 points</strong> for each friend who signs up using your referral link
                </p>
                <Link to="/dashboard/referrals">
                  <Button variant="outline" size="sm">View Referral Link</Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Gift className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Sign Up Bonus</h3>
                <p className="text-sm text-muted-foreground">
                  Get <strong className="text-secondary">50 points</strong> when you sign up with a referral code
                </p>
              </div>
            </div>

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
              <p className="text-muted-foreground mb-4">No rewards earned yet</p>
              <Link to="/dashboard/referrals">
                <Button>Start Earning with Referrals</Button>
              </Link>
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
