import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Clock, CheckCircle2, Truck, XCircle, MapPin, Calendar, DollarSign, ArrowRight, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const OrderHistory = () => {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load all orders
      const { data: allData, error: allError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (allError) throw allError;

      // Load active orders (not delivered or cancelled)
      const { data: activeData, error: activeError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .not('status', 'in', '("delivered","cancelled")')
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;

      setAllOrders(allData || []);
      setActiveOrders(activeData || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setAllOrders([]);
      setActiveOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'picked_up':
        return <Truck className="h-4 w-4" />;
      case 'washing':
      case 'drying':
      case 'folding':
        return <Package className="h-4 w-4 animate-pulse" />;
      case 'ready':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'out_for_delivery':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'picked_up':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'washing':
      case 'drying':
      case 'folding':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400';
      case 'ready':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'out_for_delivery':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
      case 'delivered':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    total: allOrders.length,
    completed: allOrders.filter(o => o.status === 'delivered').length,
    totalSpent: allOrders.reduce((sum, o) => sum + Number(o.total), 0),
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">My Orders</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track active orders and view your complete history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Link to="/dashboard/new-order">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Card className="border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Package className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-secondary/5 via-secondary/10 to-secondary/5 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.completed}</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-xl">
                <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">₦{stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Active Orders and All Orders */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14 p-1 bg-muted/50">
          <TabsTrigger value="active" className="text-sm sm:text-base data-[state=active]:shadow-md">
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-sm sm:text-base data-[state=active]:shadow-md">
            All Orders ({allOrders.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeOrders.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Active Orders</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  You don't have any orders in progress at the moment
                </p>
                <Link to="/dashboard/new-order">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Order
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeOrders.map((order, index) => (
                <Link key={order.id} to={`/dashboard/track/${order.id}`}>
                  <Card 
                    className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex items-start gap-4">
                          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-base sm:text-lg text-foreground">{order.order_number}</h3>
                              <Badge className={`${getStatusColor(order.status)} gap-1`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">
                              {order.service_type.replace('_', ' ')} • {order.item_count} {order.service_type === 'wash_fold' ? 'kg' : 'items'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Created {new Date(order.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Price & Arrow */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 pl-16 sm:pl-0">
                          <div className="text-right">
                            <p className="text-xl sm:text-2xl font-bold text-foreground">₦{Number(order.total).toLocaleString()}</p>
                            {order.pickup_date && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Pickup: {new Date(order.pickup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </div>

                      {/* Progress Steps */}
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center">
                          {['draft', 'scheduled', 'picked_up', 'washing', 'ready', 'delivered'].map((step, i) => {
                            const stepOrder = ['draft', 'scheduled', 'picked_up', 'washing', 'drying', 'folding', 'ready', 'out_for_delivery', 'delivered'];
                            const currentIndex = stepOrder.indexOf(order.status);
                            const stepIndex = stepOrder.indexOf(step);
                            const isCompleted = stepIndex <= currentIndex;
                            const isCurrent = step === order.status || 
                              (order.status === 'drying' && step === 'washing') || 
                              (order.status === 'folding' && step === 'washing') ||
                              (order.status === 'out_for_delivery' && step === 'ready');
                            
                            return (
                              <div key={step} className="flex flex-col items-center flex-1">
                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                                  isCompleted ? 'bg-primary' : 'bg-muted'
                                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`} />
                                <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block capitalize">
                                  {step === 'draft' ? 'Pending' : step.replace('_', ' ')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Orders Tab */}
        <TabsContent value="all" className="space-y-4 mt-6">
          {allOrders.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  Start your first laundry order today
                </p>
                <Link to="/dashboard/new-order">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Order
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {allOrders.map((order, index) => (
                <Link key={order.id} to={order.status !== 'delivered' && order.status !== 'cancelled' ? `/dashboard/track/${order.id}` : '#'}>
                  <div
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 gap-3 ${
                      order.status === 'delivered' || order.status === 'cancelled' ? 'opacity-75' : 'cursor-pointer'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                        <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-semibold text-foreground text-sm sm:text-base">{order.order_number}</span>
                          <Badge className={`${getStatusColor(order.status)} text-xs gap-1`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground capitalize truncate">
                          {order.service_type.replace('_', ' ')} • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                      <div className="text-right">
                        <p className="font-bold text-foreground text-base sm:text-lg">₦{Number(order.total).toLocaleString()}</p>
                        {order.item_count && (
                          <p className="text-xs text-muted-foreground">{order.item_count} items</p>
                        )}
                      </div>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderHistory;
