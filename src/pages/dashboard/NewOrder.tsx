import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Package, Sparkles, Shirt, Crown, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type ServiceType = "wash_fold" | "dry_cleaning" | "ironing" | "premium";

const services = [
  { id: "wash_fold" as ServiceType, name: "Wash & Fold", icon: Package, price: 200, description: "Per kg" },
  { id: "dry_cleaning" as ServiceType, name: "Dry Cleaning", icon: Sparkles, price: 500, description: "Per item" },
  { id: "ironing" as ServiceType, name: "Ironing", icon: Shirt, price: 150, description: "Per item" },
  { id: "premium" as ServiceType, name: "Premium", icon: Crown, price: 800, description: "Full service" },
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
          status: 'scheduled'
        });

      if (error) throw error;

      toast.success("Order created successfully!");
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Order</h1>
        <p className="text-muted-foreground">Schedule your laundry pickup</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Fill in your laundry service requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type */}
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service.id)}
                        className={`p-4 border-2 rounded-lg transition-all text-center relative ${
                          selectedService === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {selectedService === service.id && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <service.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium block">{service.name}</span>
                        <span className="text-xs text-muted-foreground">₦{service.price} {service.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item Count */}
                <div className="space-y-2">
                  <Label htmlFor="itemCount">Number of Items/Kg</Label>
                  <Input
                    id="itemCount"
                    type="number"
                    min="1"
                    max="100"
                    value={itemCount}
                    onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                  />
                </div>

                {/* Pickup Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      min={pickupDate || today}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      type="time"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Address Info */}
                {defaultAddress ? (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">Pickup & Delivery Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {defaultAddress.street_address}, {defaultAddress.city}, {defaultAddress.state}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600">
                      No default address set. Please add an address in your profile settings.
                    </p>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special care instructions..."
                    rows={4}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    maxLength={500}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Order..." : "Create Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items/Kg</span>
                <span className="font-medium">{itemCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (7.5%)</span>
                <span className="font-medium">₦{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
