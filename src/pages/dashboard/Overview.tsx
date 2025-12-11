import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, Award, MapPin, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('loyalty_points')
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

      const totalRewards = rewards?.reduce((sum, r) => sum + r.points, 0) || 0;
      const activeCount = orders?.filter(o => !['delivered', 'cancelled'].includes(o.status)).length || 0;
      const completedCount = orders?.filter(o => o.status === 'delivered').length || 0;

      setStats({
        activeOrders: activeCount,
        completedOrders: completedCount,
        loyaltyPoints: profile?.loyalty_points || 0,
        savedAddresses: addressCount || 0,
        totalRewards,
      });

      setRecentOrders(orders || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-9 w-12" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's what's happening with your laundry orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.activeOrders}</div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.completedOrders}</div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-lg animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.loyaltyPoints}</div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Award className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.totalRewards}</div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest laundry orders</CardDescription>
            </div>
            <Link to="/dashboard/history">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link to="/dashboard/new-order">
                <Button>Create Your First Order</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{order.order_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.service_type.replace('_', ' ')} • ₦{Number(order.total).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary capitalize">
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;