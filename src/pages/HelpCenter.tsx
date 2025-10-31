import { Search, HelpCircle, Package, CreditCard, Truck, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  {
    icon: Package,
    title: "Orders & Pickup",
    description: "Questions about booking and pickups",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: CreditCard,
    title: "Pricing & Payment",
    description: "Billing and payment information",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Tracking and delivery questions",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: HelpCircle,
    title: "Services",
    description: "About our laundry services",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const faqs = [
  {
    category: "Orders & Pickup",
    questions: [
      {
        q: "How do I book a pickup?",
        a: "Simply create an account, select your service type, choose a pickup date and time, and provide your address. Our driver will arrive at your scheduled time to collect your laundry."
      },
      {
        q: "Can I schedule same-day pickup?",
        a: "Yes! Same-day pickup is available for orders placed before 9 AM. Express service charges apply."
      },
      {
        q: "What areas do you serve?",
        a: "We currently serve all areas within Sokoto State, Nigeria. We're expanding to more locations soon!"
      },
      {
        q: "What if I'm not home during pickup?",
        a: "You can leave your laundry in a designated safe location, or reschedule your pickup through your account dashboard."
      },
    ]
  },
  {
    category: "Pricing & Payment",
    questions: [
      {
        q: "How much do your services cost?",
        a: "Wash & Fold starts at ₦500/kg, Dry Cleaning from ₦2,000/item, Ironing from ₦800/item, and Premium Arewa Care from ₦3,500/item. Visit our Pricing page for complete details."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash on delivery, bank transfers, and online payments through our secure payment gateway."
      },
      {
        q: "Is there a minimum order amount?",
        a: "Yes, we have a minimum order of ₦2,000 for delivery service."
      },
      {
        q: "Do you offer subscription plans?",
        a: "Yes! We offer Monthly (₦8,000) and Premium (₦15,000) plans with exclusive benefits and discounts. Check our Pricing page for details."
      },
    ]
  },
  {
    category: "Delivery",
    questions: [
      {
        q: "How long does it take to process my order?",
        a: "Standard turnaround is 48-72 hours. Express same-day service is available for an additional 50% charge on orders placed before 9 AM."
      },
      {
        q: "Can I track my order?",
        a: "Yes! All orders include real-time GPS tracking. You'll receive SMS notifications at each stage of the process."
      },
      {
        q: "What if I'm not satisfied with the service?",
        a: "We offer a 100% satisfaction guarantee. If you're not happy with our service, contact us within 24 hours and we'll make it right or provide a full refund."
      },
      {
        q: "Do you offer contactless delivery?",
        a: "Yes, we offer contactless pickup and delivery options for your safety and convenience."
      },
    ]
  },
  {
    category: "Services",
    questions: [
      {
        q: "What types of clothes can you clean?",
        a: "We clean all types of everyday clothes, traditional Nigerian wear, Arewa garments, delicate fabrics, bed linens, and more. If you're unsure, contact us for guidance."
      },
      {
        q: "Do you use eco-friendly products?",
        a: "Yes! We use 100% eco-friendly, premium detergents that are gentle on your clothes and safe for the environment."
      },
      {
        q: "Can you remove tough stains?",
        a: "We specialize in stain removal and will do our best to treat any stains. However, some stains may be permanent depending on the fabric and how long they've been there."
      },
      {
        q: "How do you care for traditional Arewa wear?",
        a: "Our Premium Arewa Care service includes hand-washing for delicate fabrics, special embroidery protection, and color preservation techniques to keep your traditional wear looking beautiful."
      },
    ]
  },
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">Support</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions or contact our support team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help..." 
                className="pl-12 h-14 text-lg border-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <Card key={category.title} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg text-center cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`p-4 rounded-xl ${category.bgColor} w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            {faqs.map((section) => (
              <div key={section.category} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-primary">{section.category}</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${section.category}-${index}`} className="border-2 rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:text-primary">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto border-2 text-center">
            <CardHeader>
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Still Need Help?</h2>
              <p className="text-muted-foreground">
                Our support team is available 24/7 to assist you
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/contact" className="w-full">
                  <Button variant="outline" className="w-full border-2">
                    Contact Support
                  </Button>
                </Link>
                <a href="tel:07067603002" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Call Us Now
                  </Button>
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Phone: 07067603002 | Email: hello@udc-laundry.ng
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
