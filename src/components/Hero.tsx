import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-nigerian-laundry.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80"></div>
        <img 
          src={heroImage} 
          alt="Premium Nigerian laundry services" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-8 animate-fade-in backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">100% Eco-Friendly Detergents</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up leading-tight">
              Clean. Fresh.{" "}
              <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Delivered.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Experience premium laundry and dry cleaning services for your traditional Arewa wear and everyday clothes. 
              Same-day delivery, GPS tracking, and eco-friendly care in Nigeria.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group w-full sm:w-auto">
                  Book Pickup Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 hover:bg-muted backdrop-blur-sm w-full sm:w-auto">
                View Services
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border shadow-sm hover:shadow-md transition-all backdrop-blur-sm group">
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Same-Day Delivery</div>
                  <div className="text-xs text-muted-foreground">Orders by 9 AM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border shadow-sm hover:shadow-md transition-all backdrop-blur-sm group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">GPS Tracked</div>
                  <div className="text-xs text-muted-foreground">Real-time updates</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border shadow-sm hover:shadow-md transition-all backdrop-blur-sm group">
                <div className="p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Premium Care</div>
                  <div className="text-xs text-muted-foreground">Eco-friendly</div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">4.9/5</span> from 500+ happy customers
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative">
              {/* Main decorative card */}
              <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
              
              {/* Main image card */}
              <div className="relative bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform">
                <img 
                  src={heroImage} 
                  alt="Clean Nigerian laundry" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Trusted by</div>
                      <div className="text-2xl font-bold text-primary">500+</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-muted-foreground">Rating</div>
                      <div className="text-2xl font-bold text-accent">4.9★</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
