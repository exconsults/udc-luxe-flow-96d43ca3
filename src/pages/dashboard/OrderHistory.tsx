import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Clock, CheckCircle2, Truck, XCircle, MapPin, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    
    // Load all orders
    const { data: allData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Load active orders (not delivered or cancelled)
    const { data: activeData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .not('status', 'in', '("delivered","cancelled")')
      .order('created_at', { ascending: false });

    setAllOrders(allData || []);
    setActiveOrders(activeData || []);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Package className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'picked_up':
        return <Truck className="h-5 w-5" />;
      case 'in_progress':
        return <Package className="h-5 w-5 animate-pulse" />;
      case 'ready':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'picked_up':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'ready':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'out_for_delivery':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400';
      case 'delivered':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track active orders and view your complete order history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">₦{stats.totalSpent.toFixed(2)}</div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Active Orders and All Orders */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="all">All Orders ({allOrders.length})</TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="active" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground animate-pulse" />
            </div>
          ) : activeOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Orders</h3>
                <p className="text-muted-foreground mb-6 text-center">
                  You don't have any orders in progress at the moment
                </p>
                <Link to="/dashboard/new-order">
                  <Button>Create New Order</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {activeOrders.map((order) => (
                <Card key={order.id} className="border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          <span>{order.order_number}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-2 capitalize">{order.status.replace('_', ' ')}</span>
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {order.service_type} • Created {new Date(order.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">₦{order.total}</div>
                        {order.item_count && (
                          <div className="text-sm text-muted-foreground">{order.item_count} items</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Timeline */}
                    <div className="space-y-3">
                      <div className={`flex items-start gap-3 ${
                        ['pending', 'picked_up', 'in_progress', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
                          ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                          ['pending', 'picked_up', 'in_progress', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
                            ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Order Placed</div>
                          <div className="text-sm text-muted-foreground">
                            Your order has been received
                          </div>
                        </div>
                      </div>

                      {order.pickup_date && (
                        <div className={`flex items-start gap-3 ${
                          ['picked_up', 'in_progress', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
                            ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                            ['picked_up', 'in_progress', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
                              ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Pickup Scheduled</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.pickup_date).toLocaleDateString()} at {order.pickup_time}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`flex items-start gap-3 ${
                        ['in_progress', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
                          ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                          ['in_progress', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)
                            ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Processing</div>
                          <div className="text-sm text-muted-foreground">
                            Your laundry is being processed
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-start gap-3 ${
                        ['out_for_delivery', 'delivered'].includes(order.status)
                          ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                          ['out_for_delivery', 'delivered'].includes(order.status)
                            ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Truck className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Out for Delivery</div>
                          {order.delivery_date && (
                            <div className="text-sm text-muted-foreground">
                              Scheduled for {new Date(order.delivery_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`flex items-start gap-3 ${
                        order.status === 'delivered' ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                          order.status === 'delivered'
                            ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Delivered</div>
                          <div className="text-sm text-muted-foreground">
                            Order will be delivered to your address
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.special_instructions && (
                      <div className="pt-4 border-t border-border">
                        <div className="text-sm font-medium text-foreground mb-1">Special Instructions</div>
                        <div className="text-sm text-muted-foreground">{order.special_instructions}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Orders Tab */}
        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground animate-pulse" />
            </div>
          ) : allOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6 text-center">
                  Start your first laundry order today
                </p>
                <Link to="/dashboard/new-order">
                  <Button>Create New Order</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-semibold text-foreground">{order.order_number}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.service_type} • {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      {order.item_count && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.item_count} items • {order.weight_lbs ? `${order.weight_lbs} lbs` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">₦{order.total}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderHistory;
