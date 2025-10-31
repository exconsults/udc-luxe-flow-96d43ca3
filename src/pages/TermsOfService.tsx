import { FileText, Scale, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using UDC (Usman Dry Cleaning) services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
  },
  {
    title: "2. Service Description",
    content: "UDC provides laundry and dry cleaning services including wash & fold, dry cleaning, ironing, and premium care for traditional Nigerian wear. We offer pickup and delivery services within Sokoto State, Nigeria."
  },
  {
    title: "3. User Accounts",
    content: "To use our services, you must create an account providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
  },
  {
    title: "4. Orders and Payment",
    content: "All orders are subject to acceptance and availability. Prices are listed in Nigerian Naira (₦) and may be subject to change. Payment is due upon delivery unless you have a subscription plan. We accept cash, bank transfers, and online payments."
  },
  {
    title: "5. Pickup and Delivery",
    content: "We will make reasonable efforts to pickup and deliver at scheduled times. Delays may occur due to circumstances beyond our control. You must provide accurate address information and be available at scheduled times or arrange alternative pickup/delivery arrangements."
  },
  {
    title: "6. Item Care and Liability",
    content: "We exercise reasonable care in handling your items. However, we are not liable for: (a) damage to items not suited for the cleaning method used, (b) color bleeding or fading in items, (c) damage to delicate trimmings, buttons, or ornaments, (d) items left in pockets, or (e) items not claimed within 30 days."
  },
  {
    title: "7. Maximum Liability",
    content: "Our liability for any lost or damaged items is limited to 10 times the cleaning charge for that item, with a maximum of ₦50,000 per order. Claims must be made within 48 hours of delivery."
  },
  {
    title: "8. Unclaimed Items",
    content: "Items not claimed within 90 days will be donated to charity. We will make reasonable attempts to contact you before disposal."
  },
  {
    title: "9. Cancellation and Refunds",
    content: "Pickup cancellations must be made at least 2 hours before scheduled time. Refunds are provided for services not rendered. Processing charges may apply to cancellations."
  },
  {
    title: "10. Subscription Plans",
    content: "Subscription plans are billed monthly and auto-renew unless cancelled. Cancellations must be made at least 7 days before renewal date. No refunds for partial months."
  },
  {
    title: "11. Prohibited Items",
    content: "We reserve the right to refuse service for items including: contaminated items, hazardous materials, items with illegal substances, or items requiring special permits."
  },
  {
    title: "12. Privacy",
    content: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information."
  },
  {
    title: "13. Modifications to Terms",
    content: "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of modified terms."
  },
  {
    title: "14. Governing Law",
    content: "These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Sokoto State."
  },
  {
    title: "15. Contact Information",
    content: "For questions about these Terms of Service, contact us at hello@udc-laundry.ng or call 07067603002."
  }
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Last updated: January 2025
            </p>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="border">
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">15 sections</span>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Your rights protected</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-slate max-w-none">
              {sections.map((section, index) => (
                <Card key={index} className="mb-6 border-2 hover:border-primary/30 transition-all">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Agreement Notice */}
            <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Agreement</h3>
                <p className="text-muted-foreground mb-6">
                  By using UDC services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <p className="text-sm text-muted-foreground">
                  Questions? Contact us at hello@udc-laundry.ng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
