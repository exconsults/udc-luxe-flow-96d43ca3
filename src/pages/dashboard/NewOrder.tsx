import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Calendar, MapPin } from "lucide-react";

const NewOrder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order Created!",
      description: "Your laundry order has been created successfully.",
    });
  };

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
                  <div className="grid grid-cols-3 gap-3">
                    {['wash_fold', 'dry_clean', 'iron_press'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors text-center"
                      >
                        <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium capitalize">
                          {type.replace('_', ' & ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pickup Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      type="time"
                      required
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special care instructions..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Proceed to Payment"}
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
                <span className="font-medium">Wash & Fold</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Items</span>
                <span className="font-medium">12 pieces</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₦2,400</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">₦500</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-primary">₦2,900</span>
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