import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, Award, TrendingUp, ArrowRight, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import OnboardingTour from "@/components/OnboardingTour";

const Overview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    loyaltyPoints: 0,
    savedAddresses: 0,
    totalRewards: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        // Load orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Load profile - use maybeSingle to avoid errors when no profile exists
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // Load addresses count
        const { count: addressCount } = await supabase
          .from('addresses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Load rewards
        const { data: rewards } = await supabase
          .from('rewards')
          .select('points')
          .eq('user_id', user.id);

        if (!isMounted) return;

        const totalRewards = rewards?.reduce((sum, r) => sum + r.points, 0) || 0;
        const activeCount = orders?.filter(o => !['delivered', 'cancelled'].includes(o.status)).length || 0;
        const completedCount = orders?.filter(o => o.status === 'delivered').length || 0;

        setStats({
          activeOrders: activeCount,
          completedOrders: completedCount,
          loyaltyPoints: profileData?.loyalty_points || 0,
          savedAddresses: addressCount || 0,
          totalRewards,
        });

        setProfile(profileData);
        setRecentOrders(orders || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      scheduled: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      picked_up: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      washing: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      drying: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      folding: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      ready: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      out_for_delivery: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      delivered: 'bg-green-500/10 text-green-600 dark:text-green-400',
      cancelled: 'bg-destructive/10 text-destructive'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Onboarding Tour for new users */}
      <OnboardingTour />
      
      {/* Welcome Section with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Here's what's happening with your laundry orders today
          </p>
        </div>
        <Link to="/dashboard/new-order">
          <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-5 w-5" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Active Orders</span>
              <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-secondary/5 via-secondary/10 to-secondary/5 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</span>
              <div className="p-2 sm:p-2.5 bg-secondary/10 rounded-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Loyalty Points</span>
              <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/5 via-purple-500/10 to-purple-500/5 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Rewards</span>
              <div className="p-2 sm:p-2.5 bg-purple-500/10 rounded-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stats.totalRewards}</div>
            <p className="text-xs text-muted-foreground mt-1">Points earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your latest laundry orders</CardDescription>
              </div>
            </div>
            <Link to="/dashboard/history">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Start your first laundry order and experience our premium service
              </p>
              <Link to="/dashboard/new-order">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create Your First Order
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order, index) => (
                <Link 
                  key={order.id} 
                  to={`/dashboard/track/${order.id}`}
                  className="block"
                >
                  <div
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 gap-3 sm:gap-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                        <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm sm:text-base">{order.order_number}</span>
                          <Badge variant="secondary" className={`${getStatusColor(order.status)} text-xs capitalize`}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {order.service_type.replace('_', ' ')} • {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                      <div className="text-right">
                        <div className="font-bold text-foreground text-base sm:text-lg">₦{Number(order.total).toLocaleString()}</div>
                        {order.item_count && (
                          <div className="text-xs text-muted-foreground">{order.item_count} items</div>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/dashboard/new-order" className="block">
          <Card className="group h-full border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5 sm:p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">New Order</h3>
                <p className="text-sm text-primary-foreground/80">Schedule a pickup</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/history" className="block">
          <Card className="group h-full border-2 border-secondary/20 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5 sm:p-6 flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Package className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base sm:text-lg">My Orders</h3>
                <p className="text-sm text-muted-foreground">View order history</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/rewards" className="block">
          <Card className="group h-full border-2 border-accent/20 hover:border-accent/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5 sm:p-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base sm:text-lg">Rewards</h3>
                <p className="text-sm text-muted-foreground">Earn & redeem points</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Overview;
