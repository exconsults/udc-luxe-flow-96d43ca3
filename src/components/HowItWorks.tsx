import { Calendar, TruckIcon, Package } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "1. Book Pickup",
    description: "Schedule a convenient pickup time through our app or website. We come to your location in Sokoto State.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Package,
    title: "2. We Clean",
    description: "Our experts handle your clothes and traditional Arewa wear with premium, eco-friendly care and attention.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: TruckIcon,
    title: "3. Fast Delivery",
    description: "Get your freshly cleaned clothes delivered back to your door. Track your order in real-time with GPS.",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-secondary">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting your laundry done has never been easier. Just three simple steps for fresh, clean clothes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connector Line (hidden on mobile, shown on md+) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 z-0"></div>
              )}

              {/* Step Card */}
              <div className="relative bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-1 text-center z-10 group">
                <div className={`p-5 rounded-full ${step.bgColor} w-fit mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <step.icon className={`h-10 w-10 ${step.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-primary/20">
            <div className="text-left">
              <div className="text-sm text-muted-foreground mb-1">Available in</div>
              <div className="text-xl font-bold text-foreground">Sokoto State</div>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-left">
              <div className="text-sm text-muted-foreground mb-1">Starting from</div>
              <div className="text-xl font-bold text-primary">₦500/kg</div>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-left">
              <div className="text-sm text-muted-foreground mb-1">Delivery</div>
              <div className="text-xl font-bold text-secondary">Same Day</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
