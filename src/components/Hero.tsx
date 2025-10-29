import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-laundry.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Premium laundry services" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">100% Biodegradable Detergents</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
            Clean. Fresh.{" "}
            <span className="text-gradient">Delivered.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Experience premium laundry and dry cleaning services with same-day delivery, 
            GPS tracking, and eco-friendly care. Your clothes deserve the best.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group">
                Book Pickup Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 hover:bg-muted">
              View Services
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Same-Day Delivery</div>
                <div className="text-xs text-muted-foreground">Orders by 9 AM</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">GPS Tracked</div>
                <div className="text-xs text-muted-foreground">Real-time updates</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 rounded-lg bg-accent/20">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-sm">Premium Care</div>
                <div className="text-xs text-muted-foreground">Eco-friendly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
