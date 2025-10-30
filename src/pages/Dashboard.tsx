import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, MapPin, Award, Plus, WifiOff, Wifi, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { offlineStorage, OfflineOrder } from "@/lib/offline-storage";

const Dashboard = () => {
  const { user, isOnline, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OfflineOrder[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load offline data
    const loadData = async () => {
      const cachedOrders = await offlineStorage.getOrders(user.id);
      setOrders(cachedOrders);

      const cachedProfile = await offlineStorage.getProfile(user.id);
      setProfile(cachedProfile);
    };

    loadData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {profile?.firstName || 'User'}!
                </h1>
                {!isOnline && (
                  <div className="px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-full flex items-center gap-2">
                    <WifiOff className="h-4 w-4 text-destructive" />
                    <span className="text-xs font-medium text-destructive">Offline</span>
                  </div>
                )}
                {isOnline && (
                  <div className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-medium text-secondary">Online</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">
                {isOnline ? 'Manage your laundry orders and track deliveries' : 'Viewing cached data - changes will sync when online'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard/new-order">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{activeOrders.length}</div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{completedCount}</div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loyalty Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{profile?.loyaltyPoints || 0}</div>
                <Award className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saved Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">0</div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Orders {!isOnline && <span className="text-sm font-normal text-muted-foreground">(Cached)</span>}</CardTitle>
            <CardDescription>Track your current laundry orders</CardDescription>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active orders</p>
                <Link to="/dashboard/new-order">
                  <Button className="mt-4">Create Your First Order</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.slice(0, 3).map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{order.orderNumber || 'Draft'}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.serviceType} • {order.weightLbs ? `${order.weightLbs} lbs` : `${order.itemCount} items`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary mb-1 capitalize">
                        {order.status.replace('_', ' ')}
                      </div>
                      {!order.isSynced && (
                        <div className="text-xs text-muted-foreground">Pending sync</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Button variant="outline" className="w-full">View All Orders</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg">Track Order</CardTitle>
              <CardDescription>See real-time location and status</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-secondary/50">
            <CardHeader>
              <CardTitle className="text-lg">Order History</CardTitle>
              <CardDescription>View all past orders and receipts</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">Rewards</CardTitle>
              <CardDescription>Redeem your loyalty points</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
