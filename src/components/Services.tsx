import { Shirt, Wind, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import nigerianWashing from "@/assets/nigerian-washing.jpg";
import nigerianIroning from "@/assets/nigerian-ironing.jpg";

const services = [
  {
    icon: Shirt,
    title: "Wash & Fold",
    description: "Professional washing, drying, and folding. Fresh and ready to wear.",
    price: "From ₦500/kg",
    color: "text-primary",
    bgColor: "bg-primary/10",
    image: nigerianWashing,
  },
  {
    icon: Wind,
    title: "Dry Cleaning",
    description: "Expert care for delicate fabrics, Arewa wear, and special garments.",
    price: "From ₦2,000/item",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    image: null,
  },
  {
    icon: Sparkles,
    title: "Ironing Service",
    description: "Crisp, wrinkle-free clothes and traditional wear with precision pressing.",
    price: "From ₦800/item",
    color: "text-accent",
    bgColor: "bg-accent/20",
    image: nigerianIroning,
  },
  {
    icon: Sparkles,
    title: "Premium Arewa Care",
    description: "Luxury treatment for your finest traditional Hausa clothing and embroidery.",
    price: "From ₦3,500/item",
    color: "text-primary",
    bgColor: "bg-gradient-to-br from-primary/10 to-accent/10",
    image: null,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Our Services</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Premium Laundry Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of premium services designed to keep your clothes and traditional wear looking their best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up group overflow-hidden relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.image && (
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                </div>
              )}
              <CardContent className={`p-6 ${service.image ? '-mt-8 relative z-10' : ''}`}>
                <div className={`p-4 rounded-xl ${service.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 min-h-[3rem]">{service.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">{service.price}</p>
                  <span className="text-xs text-muted-foreground">NGN</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

              <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-lg">Trusted by Nigerians for premium laundry care</p>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              Sokoto State Delivery
            </span>
            <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
              Arewa Specialists
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
