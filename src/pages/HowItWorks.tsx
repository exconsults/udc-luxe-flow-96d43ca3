import { Calendar, TruckIcon, Package, Smartphone, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    icon: Smartphone,
    title: "1. Book Online",
    description: "Schedule a pickup through our website or app. Choose your preferred time slot.",
    details: [
      "Select service type",
      "Choose pickup date & time",
      "Provide delivery address",
      "Add special instructions"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Calendar,
    title: "2. We Pick Up",
    description: "Our driver arrives at your location to collect your laundry items.",
    details: [
      "GPS-tracked pickup",
      "Professional staff",
      "Item counting",
      "Receipt provided"
    ],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Package,
    title: "3. Expert Cleaning",
    description: "Your clothes are cleaned with premium eco-friendly products and care.",
    details: [
      "Quality inspection",
      "Professional cleaning",
      "Stain treatment",
      "Quality control check"
    ],
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: TruckIcon,
    title: "4. Fast Delivery",
    description: "Your freshly cleaned clothes are delivered back to your door.",
    details: [
      "Same-day delivery available",
      "Real-time GPS tracking",
      "Notification alerts",
      "Contactless delivery option"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const features = [
  {
    icon: MapPin,
    title: "GPS Tracking",
    description: "Track your order in real-time from pickup to delivery"
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Pay online or cash on delivery - your choice"
  },
  {
    icon: CheckCircle,
    title: "Quality Guarantee",
    description: "100% satisfaction guaranteed or we'll make it right"
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-secondary">Simple Process</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Getting your laundry done has never been easier. Just four simple steps for fresh, clean clothes delivered to your door.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 z-0"></div>
                )}

                <Card className="relative border-2 hover:border-primary/50 transition-all hover:shadow-xl group h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`p-5 rounded-full ${step.bgColor} w-fit mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <step.icon className={`h-10 w-10 ${step.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                    
                    <div className="space-y-2 text-left">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Why Choose UDC?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make laundry convenient, reliable, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-all text-center">
                <CardContent className="p-8">
                  <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-6">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your first pickup today and experience the convenience of professional laundry care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                Book Pickup Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-2">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
