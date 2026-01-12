import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Package, Clock, CheckCircle2, Truck, XCircle, MapPin, 
  RefreshCw, FileText, Calendar, Search, QrCode, ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

interface Order {
  id: string;
  order_number: string;
  service_type: string;
  status: string;
  created_at: string;
  pickup_date: string | null;
  pickup_time: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  item_count: number | null;
  total: number;
  staff_notes: string | null;
  special_instructions: string | null;
}

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const lookupOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('public-order-lookup', {
        body: { order_number: orderNumber.trim() }
      });

      if (fnError) {
        setError("Failed to lookup order. Please try again.");
        setOrder(null);
      } else if (data.error) {
        setError(data.error);
        setOrder(null);
      } else {
        setOrder(data.order);
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
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

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order number to see real-time status updates
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={lookupOrder} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter order number (e.g., ORD-XXXXXX)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  className="pl-10 font-mono"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Track"
                )}
              </Button>
            </form>
            {error && searched && (
              <p className="text-destructive text-sm mt-3">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Order Results */}
        {order && (
          <div className="space-y-6 animate-fade-in">
            {/* Order Status Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      Order Status
                      <Badge className={getStatusColor(order.status)}>
                        {order.status === 'scheduled' ? 'Approved' : order.status.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {order.service_type.replace('_', ' ')} • Created {new Date(order.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">₦{order.total.toLocaleString()}</div>
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
                                {step.key === 'draft' && 'Awaiting payment confirmation'}
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
                    <div className="text-muted-foreground">Order Number</div>
                    <div className="font-mono font-medium text-foreground">{order.order_number}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Service Type</div>
                    <div className="font-medium text-foreground capitalize">{order.service_type.replace('_', ' ')}</div>
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
                </div>

                {order.staff_notes && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium text-foreground mb-1">Notes</div>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {order.staff_notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Share This Order
                </CardTitle>
                <CardDescription>
                  Scan or share this QR code to access this tracking page
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <QRCodeSVG
                    value={`${window.location.origin}/track?order=${order.order_number}`}
                    size={150}
                    level="H"
                    includeMargin
                  />
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {order.order_number}
                </div>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => lookupOrder()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searched && !order && !loading && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Order Found</h3>
              <p className="text-muted-foreground text-center">
                We couldn't find an order with that number. Please check and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Login CTA */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="flex items-center justify-between py-4 flex-wrap gap-4">
            <div>
              <p className="font-medium text-foreground">Want to manage all your orders?</p>
              <p className="text-sm text-muted-foreground">Sign in to access your full order history</p>
            </div>
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
