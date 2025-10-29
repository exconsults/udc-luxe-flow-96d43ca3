import { Shirt, Wind, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Shirt,
    title: "Wash & Fold",
    description: "Professional washing, drying, and folding. Fresh and ready to wear.",
    price: "From $2/lb",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Wind,
    title: "Dry Cleaning",
    description: "Expert care for delicate fabrics and special garments.",
    price: "From $8/item",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Sparkles,
    title: "Ironing Service",
    description: "Crisp, wrinkle-free clothes with precision pressing.",
    price: "From $3/item",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: Sparkles,
    title: "Premium Care",
    description: "Luxury treatment for your finest wardrobe items.",
    price: "From $15/item",
    color: "text-primary",
    bgColor: "bg-gradient-to-br from-primary/10 to-accent/10",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of premium laundry services designed to keep your clothes looking their best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`p-4 rounded-xl ${service.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <p className="text-lg font-bold text-primary">{service.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
