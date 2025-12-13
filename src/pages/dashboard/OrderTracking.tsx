import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Package, Clock, CheckCircle2, Truck, XCircle, MapPin, 
  ArrowLeft, RefreshCw, FileText, Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const orderSteps = [
  { key: 'draft', label: 'Pending Payment', icon: FileText },
  { key: 'scheduled', label: 'Approved', icon: Calendar },
  { key: 'pending', label: 'Pending Pickup', icon: Clock },
  { key: 'picked_up', label: 'Picked Up', icon: MapPin },
  { key: 'in_progress', label: 'Processing', icon: Package },
  { key: 'ready', label: 'Ready', icon: CheckCircle2 },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && orderId) {
      loadOrder();
      // Set up real-time subscription
      const channel = supabase
        .channel(`order-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            setOrder(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, orderId]);

  const loadOrder = async () => {
    if (!user || !orderId) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setOrder(data);
    }
    setLoading(false);
  };

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return orderSteps.findIndex(step => step.key === status);
  };

  const getProgress = () => {
    if (!order) return 0;
    if (order.status === 'cancelled') return 0;
    if (order.status === 'delivered') return 100;
    const currentIndex = getStepIndex(order.status);
    return Math.round(((currentIndex + 1) / orderSteps.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-6 text-center">
              We couldn't find this order or you don't have access to it.
            </p>
            <Link to="/dashboard/history">
              <Button>View All Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/history">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Track Order</h1>
          <p className="text-muted-foreground">{order.order_number}</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrder}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Order Status Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                Order Status
                <Badge className={getStatusColor(order.status)}>
                  {order.status === 'scheduled' ? 'Approved' : order.status.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
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
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          {order.status !== 'cancelled' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-3" />
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4 pt-4">
            {order.status === 'cancelled' ? (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <div className="font-semibold text-destructive">Order Cancelled</div>
                  <div className="text-sm text-muted-foreground">
                    This order has been cancelled
                  </div>
                </div>
              </div>
            ) : (
              orderSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.icon;
                
                return (
                  <div
                    key={step.key}
                    className={`flex items-start gap-4 ${
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                            : isCompleted
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <StepIcon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                      </div>
                      {index < orderSteps.length - 1 && (
                        <div
                          className={`absolute left-1/2 top-10 w-0.5 h-8 -translate-x-1/2 ${
                            isCompleted && index < currentStepIndex
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                        {step.label}
                      </div>
                      {isCurrent && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {step.key === 'draft' && 'Awaiting cash payment confirmation from admin'}
                          {step.key === 'scheduled' && 'Your order has been approved and scheduled'}
                          {step.key === 'pending' && 'Waiting for pickup'}
                          {step.key === 'picked_up' && 'Your laundry has been picked up'}
                          {step.key === 'in_progress' && 'Your laundry is being cleaned'}
                          {step.key === 'ready' && 'Your laundry is ready for delivery'}
                          {step.key === 'out_for_delivery' && 'Your laundry is on the way'}
                          {step.key === 'delivered' && 'Your laundry has been delivered'}
                        </div>
                      )}
                    </div>
                    {isCompleted && !isCurrent && (
                      <CheckCircle2 className="h-5 w-5 text-primary mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Service Type</div>
              <div className="font-medium text-foreground capitalize">{order.service_type}</div>
            </div>
            {order.pickup_date && (
              <div>
                <div className="text-muted-foreground">Pickup Date</div>
                <div className="font-medium text-foreground">
                  {new Date(order.pickup_date).toLocaleDateString()} {order.pickup_time && `at ${order.pickup_time}`}
                </div>
              </div>
            )}
            {order.delivery_date && (
              <div>
                <div className="text-muted-foreground">Delivery Date</div>
                <div className="font-medium text-foreground">
                  {new Date(order.delivery_date).toLocaleDateString()} {order.delivery_time && `at ${order.delivery_time}`}
                </div>
              </div>
            )}
            {order.weight_lbs && (
              <div>
                <div className="text-muted-foreground">Weight</div>
                <div className="font-medium text-foreground">{order.weight_lbs} lbs</div>
              </div>
            )}
          </div>

          {order.staff_notes && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm font-medium text-foreground mb-1">Admin Notes</div>
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {order.staff_notes}
              </div>
            </div>
          )}

          {order.special_instructions && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm font-medium text-foreground mb-1">Special Instructions</div>
              <div className="text-sm text-muted-foreground">{order.special_instructions}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Live updates enabled
      </div>
    </div>
  );
};

export default OrderTracking;
