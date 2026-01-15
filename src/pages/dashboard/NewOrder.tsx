import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Package, Sparkles, Shirt, Crown, Check, AlertCircle, Calendar, Clock, MapPin, CreditCard, Minus, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type ServiceType = "wash_fold" | "dry_cleaning" | "ironing" | "premium";

const services = [
  { id: "wash_fold" as ServiceType, name: "Wash & Fold", icon: Package, price: 200, description: "Per kg", color: "primary" },
  { id: "dry_cleaning" as ServiceType, name: "Dry Cleaning", icon: Sparkles, price: 500, description: "Per item", color: "purple" },
  { id: "ironing" as ServiceType, name: "Ironing", icon: Shirt, price: 150, description: "Per item", color: "blue" },
  { id: "premium" as ServiceType, name: "Premium", icon: Crown, price: 800, description: "Full service", color: "amber" },
];

const NewOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>("wash_fold");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [itemCount, setItemCount] = useState(1);

  // Fetch user's default address
  const { data: defaultAddress } = useQuery({
    queryKey: ['default-address', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const selectedServiceData = services.find(s => s.id === selectedService);
  const subtotal = (selectedServiceData?.price || 0) * itemCount;
  const deliveryFee = 500;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + deliveryFee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to create an order");
      return;
    }

    if (!pickupDate || !pickupTime || !deliveryDate || !deliveryTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Generate order number
      const { data: orderNumber, error: orderNumError } = await supabase
        .rpc('generate_order_number');
      
      if (orderNumError) throw orderNumError;

      // Create order as 'draft' status (pending cash payment)
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          service_type: selectedService,
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          delivery_date: deliveryDate,
          delivery_time: deliveryTime,
          special_instructions: instructions || null,
          item_count: itemCount,
          pickup_address_id: defaultAddress?.id || null,
          delivery_address_id: defaultAddress?.id || null,
          subtotal: subtotal,
          tax: tax,
          total: total,
          status: 'draft' // Pending cash payment approval
        });

      if (error) throw error;

      toast.success("Order created successfully! Please pay cash to admin for approval.");
      navigate('/dashboard/history');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const incrementCount = () => setItemCount(prev => Math.min(prev + 1, 100));
  const decrementCount = () => setItemCount(prev => Math.max(prev - 1, 1));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Create New Order</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Schedule your laundry pickup and delivery</p>
      </div>

      {/* Cash Payment Notice */}
      <Alert className="mb-6 border-primary/30 bg-primary/5">
        <CreditCard className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <span className="font-semibold text-primary">Cash Payment:</span>{' '}
          <span className="text-foreground">Orders are created as pending. Pay cash during pickup, and admin will approve your order.</span>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Select Service
              </CardTitle>
              <CardDescription>Choose your laundry service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {services.map((service) => {
                  const isSelected = selectedService === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`relative p-4 sm:p-5 border-2 rounded-2xl transition-all duration-200 text-left group ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="p-1 bg-primary rounded-full">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <service.icon className={`h-7 w-7 sm:h-8 sm:w-8 mb-3 transition-colors ${
                        isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                      <h3 className={`font-semibold text-sm sm:text-base mb-1 ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}>
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        ₦{service.price} {service.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Item Count */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Quantity
              </CardTitle>
              <CardDescription>Number of items or kilograms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={decrementCount}
                  disabled={itemCount <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="text-center min-w-[100px]">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">{itemCount}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedService === 'wash_fold' ? 'kg' : 'items'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={incrementCount}
                  disabled={itemCount >= 100}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Schedule
              </CardTitle>
              <CardDescription>Set pickup and delivery times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <div className="p-1.5 bg-secondary/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-secondary" />
                  </div>
                  Pickup Schedule
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate" className="text-xs text-muted-foreground">Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="h-11 sm:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime" className="text-xs text-muted-foreground">Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="h-11 sm:h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <div className="p-1.5 bg-accent/10 rounded-lg">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  Delivery Schedule
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate" className="text-xs text-muted-foreground">Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      min={pickupDate || today}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="h-11 sm:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime" className="text-xs text-muted-foreground">Time</Label>
                    <Input
                      id="deliveryTime"
                      type="time"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="h-11 sm:h-12"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {defaultAddress ? (
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{defaultAddress.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {defaultAddress.street_address}, {defaultAddress.city}, {defaultAddress.state}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">No default address set</p>
                      <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                        Please add an address in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Special Instructions</CardTitle>
              <CardDescription>Any special care requirements (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="E.g., Handle delicates with care, separate colors..."
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {instructions.length}/500
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground pb-6">
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <CardDescription className="text-primary-foreground/80">Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <selectedServiceData.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{selectedServiceData?.name}</span>
                  </div>
                  <span className="font-medium">₦{selectedServiceData?.price}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{itemCount} {selectedService === 'wash_fold' ? 'kg' : 'items'}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7.5%)</span>
                  <span className="font-medium">₦{tax.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">₦{total.toLocaleString()}</span>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Button 
                  onClick={handleSubmit}
                  className="w-full h-12 sm:h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Creating Order...
                    </>
                  ) : (
                    "Create Order"
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Pay cash during pickup for approval
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
