import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Abubakar Ibrahim",
    role: "Business Owner",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abubakar",
    rating: 5,
    text: "UDC has been excellent for my Arewa wear. They handle my Babban Riga with great care and the embroidery always looks perfect!",
  },
  {
    name: "Fatima Yusuf",
    role: "Fashion Designer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    rating: 5,
    text: "Professional service! They understand how to care for traditional Nigerian clothes. My kaftans come back looking brand new.",
  },
  {
    name: "Musa Abdullahi",
    role: "Government Official",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Musa",
    rating: 5,
    text: "Same-day delivery is a lifesaver! GPS tracking means I always know when my clothes will arrive. Highly recommended!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-accent/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-accent">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of satisfied customers across Nigeria who trust us with their clothes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-primary/10"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
