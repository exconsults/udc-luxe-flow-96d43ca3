import { Shirt, Wind, Sparkles, Package, Clock, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import nigerianWashing from "@/assets/nigerian-washing.jpg";
import nigerianIroning from "@/assets/nigerian-ironing.jpg";

const services = [
  {
    icon: Shirt,
    title: "Wash & Fold",
    description: "Professional washing, drying, and folding service for your everyday clothes.",
    price: "₦500/kg",
    features: [
      "Premium eco-friendly detergents",
      "Soft fabric conditioning",
      "Precise folding technique",
      "Fresh scent guarantee",
      "24-hour turnaround available"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
    image: nigerianWashing,
  },
  {
    icon: Wind,
    title: "Dry Cleaning",
    description: "Expert care for delicate fabrics, traditional Arewa wear, and special garments.",
    price: "₦2,000/item",
    features: [
      "Specialized solvent cleaning",
      "Hand-finished pressing",
      "Stain treatment expertise",
      "Fabric protection",
      "Traditional wear specialists"
    ],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    image: null,
  },
  {
    icon: Sparkles,
    title: "Ironing Service",
    description: "Crisp, wrinkle-free clothes and traditional wear with precision pressing.",
    price: "₦800/item",
    features: [
      "Professional steam pressing",
      "Collar and cuff detailing",
      "Embroidery-safe techniques",
      "Hang or fold options",
      "Same-day service available"
    ],
    color: "text-accent",
    bgColor: "bg-accent/20",
    image: nigerianIroning,
  },
  {
    icon: Package,
    title: "Premium Arewa Care",
    description: "Luxury treatment for your finest traditional Hausa clothing and embroidery.",
    price: "₦3,500/item",
    features: [
      "Hand-washing for delicate fabrics",
      "Embroidery protection methods",
      "Color preservation treatment",
      "Expert stain removal",
      "Careful packaging"
    ],
    color: "text-primary",
    bgColor: "bg-gradient-to-br from-primary/10 to-accent/10",
    image: null,
  },
];

const additionalServices = [
  {
    icon: Clock,
    title: "Express Service",
    description: "Need your clothes urgently? Get same-day service for orders placed before 9 AM.",
    price: "+50% surcharge"
  },
  {
    icon: Shield,
    title: "Subscription Plans",
    description: "Regular pickup and delivery with priority scheduling and discounted rates.",
    price: "From ₦8,000/month"
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">Our Services</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Premium Laundry & Dry Cleaning Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional care for your everyday clothes and traditional Nigerian wear. Eco-friendly, reliable, and delivered to your door in Sokoto State.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                Book Pickup Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.title}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group overflow-hidden"
              >
                {service.image && (
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                  </div>
                )}
                <CardContent className={`p-8 ${service.image ? '-mt-16 relative z-10' : ''}`}>
                  <div className={`p-4 rounded-xl ${service.bgColor} w-fit mb-6`}>
                    <service.icon className={`h-10 w-10 ${service.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-primary mb-6">{service.price}</div>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extra convenience and flexibility for your laundry needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {additionalServices.map((service) => (
              <Card key={service.title} className="border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-8">
                  <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6">
                    <service.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="text-xl font-bold text-primary">{service.price}</div>
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
            Ready to Experience Premium Laundry Care?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your first pickup today and discover why hundreds of customers trust us with their clothes.
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

export default Services;
