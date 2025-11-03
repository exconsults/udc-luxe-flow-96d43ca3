import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setFilteredOrders(data || []);
    setLoading(false);
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

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order History</h1>
          <p className="text-muted-foreground">View all your past and current orders</p>
        </div>
        <Link to="/dashboard/new-order">
          <Button>New Order</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{orders.length}</div>
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
              <div className="text-3xl font-bold text-foreground">{completedOrders}</div>
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
              <div className="text-3xl font-bold text-foreground">₦{totalSpent.toFixed(2)}</div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Showing {filteredOrders.length} orders</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground animate-pulse" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {statusFilter === "all" ? "No orders found" : `No ${statusFilter} orders found`}
              </p>
              {statusFilter !== "all" && (
                <Button variant="outline" onClick={() => setStatusFilter("all")}>
                  Clear Filter
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
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
                    <Link to="/dashboard/track">
                      <Button variant="ghost" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </Link>
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

export default OrderHistory;
