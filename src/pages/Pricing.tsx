import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pricingTiers = [
  {
    name: "Pay As You Go",
    description: "Perfect for occasional use",
    popular: false,
    features: [
      "No commitment required",
      "Standard pickup & delivery",
      "72-hour turnaround",
      "Basic customer support",
      "Cash or online payment"
    ],
  },
  {
    name: "Monthly Plan",
    price: "₦8,000",
    description: "Best for regular customers",
    popular: true,
    features: [
      "Priority scheduling",
      "48-hour turnaround",
      "10% discount on all services",
      "Free express service once/month",
      "Dedicated support line",
      "SMS notifications"
    ],
  },
  {
    name: "Premium Plan",
    price: "₦15,000",
    description: "Ultimate convenience",
    popular: false,
    features: [
      "Same-day turnaround",
      "20% discount on all services",
      "Unlimited express service",
      "VIP customer support",
      "Real-time GPS tracking",
      "Flexible pickup times",
      "Special occasion rush service"
    ],
  },
];

const servicesPricing = [
  {
    category: "Wash & Fold",
    items: [
      { name: "Regular clothes", price: "₦500/kg" },
      { name: "Bed linens", price: "₦800/kg" },
      { name: "Towels", price: "₦600/kg" },
    ]
  },
  {
    category: "Dry Cleaning",
    items: [
      { name: "Shirts/Blouses", price: "₦1,500/item" },
      { name: "Trousers/Skirts", price: "₦1,800/item" },
      { name: "Traditional wear", price: "₦2,500/item" },
      { name: "Suits", price: "₦4,000/item" },
    ]
  },
  {
    category: "Ironing",
    items: [
      { name: "Shirts", price: "₦600/item" },
      { name: "Trousers", price: "₦800/item" },
      { name: "Traditional wear", price: "₦1,200/item" },
    ]
  },
  {
    category: "Premium Services",
    items: [
      { name: "Arewa embroidery care", price: "₦3,500/item" },
      { name: "Stain removal", price: "₦1,000/item" },
      { name: "Express same-day", price: "+50%" },
    ]
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">Transparent Pricing</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Simple, Affordable Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose a plan that works for you or pay as you go. No hidden fees, just quality service.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Subscription Plans
            </h2>
            <p className="text-lg text-muted-foreground">
              Save more with our monthly subscription plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name}
                className={`relative border-2 transition-all hover:shadow-xl ${
                  tier.popular ? 'border-primary shadow-lg scale-105' : 'hover:border-primary/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
                  {tier.price ? (
                    <div className="text-4xl font-bold text-primary">
                      {tier.price}
                      <span className="text-lg text-muted-foreground">/month</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-muted-foreground">
                      Standard Rates Apply
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/auth">
                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Pricing */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Service Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Clear pricing for all our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {servicesPricing.map((service) => (
              <Card key={service.category} className="border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <h3 className="text-2xl font-bold">{service.category}</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold text-primary">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              * All prices are in Nigerian Naira (₦). Minimum order ₦2,000 for delivery.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your first pickup today and enjoy professional laundry care at affordable prices.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              Book Pickup Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
