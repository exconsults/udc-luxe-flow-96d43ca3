import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us including: name, email address, phone number, delivery address, payment information, and order history. We also automatically collect device information, IP address, and usage data through cookies and similar technologies."
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: "We use your information to: process and fulfill orders, communicate with you about services, send notifications and updates, improve our services, process payments, provide customer support, and comply with legal obligations."
  },
  {
    icon: UserCheck,
    title: "3. Information Sharing",
    content: "We do not sell your personal information. We may share information with: service providers who assist our operations (payment processors, delivery partners), law enforcement when required by law, and business partners with your explicit consent."
  },
  {
    icon: Lock,
    title: "4. Data Security",
    content: "We implement appropriate technical and organizational measures to protect your personal information including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure."
  },
  {
    icon: Globe,
    title: "5. Your Rights",
    content: "You have the right to: access your personal data, correct inaccurate information, request deletion of your data, object to processing, withdraw consent at any time, and receive a copy of your data. Contact us to exercise these rights."
  },
  {
    icon: Shield,
    title: "6. Data Retention",
    content: "We retain your personal information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Order history is kept for 7 years for accounting purposes."
  },
];

const additionalSections = [
  {
    title: "7. Cookies and Tracking",
    content: "We use cookies and similar technologies to improve user experience, analyze usage patterns, and personalize content. You can control cookies through your browser settings, but disabling cookies may limit functionality."
  },
  {
    title: "8. Third-Party Services",
    content: "Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. Please review their privacy policies before providing information."
  },
  {
    title: "9. Children's Privacy",
    content: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately."
  },
  {
    title: "10. GPS and Location Data",
    content: "With your permission, we collect location data to provide pickup and delivery services, track orders in real-time, and improve route efficiency. You can disable location services in your device settings."
  },
  {
    title: "11. Marketing Communications",
    content: "We may send you promotional emails about our services, special offers, and updates. You can opt-out of marketing communications at any time by clicking the unsubscribe link or contacting us."
  },
  {
    title: "12. Data Transfers",
    content: "Your information may be transferred to and processed in locations outside Nigeria. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy."
  },
  {
    title: "13. Changes to Privacy Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of material changes by email or through our service. Continued use after changes constitutes acceptance of the updated policy."
  },
  {
    title: "14. Contact Us",
    content: "For questions, concerns, or to exercise your privacy rights, contact our Data Protection Officer at: Email: hello@udc-laundry.ng, Phone: 07067603002, Address: Sabon Titin Area, Sokoto State, Nigeria."
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Last updated: January 2025
            </p>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border text-center">
              <CardContent className="p-6">
                <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Secure</h3>
                <p className="text-sm text-muted-foreground">Data encrypted and protected</p>
              </CardContent>
            </Card>
            <Card className="border text-center">
              <CardContent className="p-6">
                <Eye className="h-10 w-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Transparent</h3>
                <p className="text-sm text-muted-foreground">Clear about data usage</p>
              </CardContent>
            </Card>
            <Card className="border text-center">
              <CardContent className="p-6">
                <UserCheck className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-2">Control</h3>
                <p className="text-sm text-muted-foreground">You control your data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Sections with Icons */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {sections.map((section, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-8">
                    <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6">
                      <section.icon className="h-8 w-8 text-primary" />
                    </div>
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

            {/* Additional Sections */}
            <div className="space-y-6">
              {additionalSections.map((section, index) => (
                <Card key={index} className="border-2 hover:border-primary/30 transition-all">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Commitment Notice */}
            <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h3>
                <p className="text-muted-foreground mb-6">
                  We are committed to protecting your privacy and handling your data with care and transparency. If you have any questions or concerns about how we handle your information, please don't hesitate to contact us.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Email:</strong> hello@udc-laundry.ng</p>
                  <p><strong>Phone:</strong> 07067603002</p>
                  <p><strong>Address:</strong> Sabon Titin Area, Sokoto State, Nigeria</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
