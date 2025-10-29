import { Calendar, TruckIcon, Package } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "1. Book Pickup",
    description: "Schedule a convenient pickup time through our app or website. We'll come to you.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Package,
    title: "2. We Clean",
    description: "Our experts handle your clothes with premium, eco-friendly care and attention.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: TruckIcon,
    title: "3. Fast Delivery",
    description: "Get your freshly cleaned clothes delivered back to your door. Track in real-time.",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting your laundry done has never been easier. Just three simple steps.
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
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 z-0"></div>
              )}

              {/* Step Card */}
              <div className="relative bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-lg text-center z-10">
                <div className={`p-5 rounded-full ${step.bgColor} w-fit mx-auto mb-6 hover:scale-110 transition-transform`}>
                  <step.icon className={`h-10 w-10 ${step.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
