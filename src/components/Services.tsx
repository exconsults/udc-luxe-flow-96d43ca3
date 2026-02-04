import { Shirt, Wind, Sparkles, Package, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServicePrices } from "@/hooks/useServicePrices";
import nigerianWashing from "@/assets/nigerian-washing.jpg";
import nigerianIroning from "@/assets/nigerian-ironing.jpg";

const serviceIcons: Record<string, any> = {
  wash_fold: Package,
  dry_cleaning: Wind,
  ironing: Shirt,
  premium: Crown,
};

const serviceImages: Record<string, string | null> = {
  wash_fold: nigerianWashing,
  dry_cleaning: null,
  ironing: nigerianIroning,
  premium: null,
};

const serviceColors: Record<string, { color: string; bgColor: string }> = {
  wash_fold: { color: "text-primary", bgColor: "bg-primary/10" },
  dry_cleaning: { color: "text-secondary", bgColor: "bg-secondary/10" },
  ironing: { color: "text-accent", bgColor: "bg-accent/20" },
  premium: { color: "text-primary", bgColor: "bg-gradient-to-br from-primary/10 to-accent/10" },
};

const Services = () => {
  const { data: servicePrices, isLoading } = useServicePrices();

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
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-16 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            servicePrices?.map((service, index) => {
              const IconComponent = serviceIcons[service.service_type] || Sparkles;
              const image = serviceImages[service.service_type];
              const colors = serviceColors[service.service_type] || { color: "text-primary", bgColor: "bg-primary/10" };
              
              return (
                <Card 
                  key={service.id}
                  className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up group overflow-hidden relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {image && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={image} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                    </div>
                  )}
                  <CardContent className={`p-6 ${image ? '-mt-8 relative z-10' : ''}`}>
                    <div className={`p-4 rounded-xl ${colors.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 ${colors.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 min-h-[3rem]">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-primary">
                        From ₦{service.base_price.toLocaleString()}/{service.price_unit.replace('per ', '')}
                      </p>
                      <span className="text-xs text-muted-foreground">NGN</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
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

