import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  UserPlus, 
  LogIn, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Award, 
  Settings, 
  MapPin,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import html2pdf from "html2pdf.js";

const UserGuide = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const element = contentRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'UDC-Laundry-User-Guide.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Guide</h1>
          <p className="text-muted-foreground mt-1">Complete guide to using UDC Laundry Service</p>
        </div>
        <Button onClick={handleDownloadPDF} disabled={isDownloading} className="gap-2">
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div ref={contentRef} className="space-y-6 pr-4">
          {/* Header for PDF */}
          <div className="bg-primary text-primary-foreground p-6 rounded-lg text-center">
            <h1 className="text-2xl font-bold">UDC Laundry Service</h1>
            <p className="text-primary-foreground/80 mt-1">Complete User Guide</p>
          </div>

          {/* Section 1: Registration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    1. Creating Your Account
                    <Badge variant="secondary">Getting Started</Badge>
                  </CardTitle>
                  <CardDescription>Register to access all our services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">1</div>
                  <div>
                    <p className="font-medium">Visit the Registration Page</p>
                    <p className="text-muted-foreground text-sm">Click on "Sign Up" or "Get Started" button on the homepage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">2</div>
                  <div>
                    <p className="font-medium">Enter Your Details</p>
                    <p className="text-muted-foreground text-sm">Provide your email address and create a secure password</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">3</div>
                  <div>
                    <p className="font-medium">Complete Your Profile</p>
                    <p className="text-muted-foreground text-sm">Add your name, phone number, and delivery address for seamless service</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Login */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <LogIn className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    2. Logging In
                    <Badge variant="outline">Access</Badge>
                  </CardTitle>
                  <CardDescription>Access your account securely</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                  <div>
                    <p className="font-medium">Go to Login Page</p>
                    <p className="text-muted-foreground text-sm">Click "Sign In" on the homepage or navigation menu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                  <div>
                    <p className="font-medium">Enter Credentials</p>
                    <p className="text-muted-foreground text-sm">Use your registered email and password to sign in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                  <div>
                    <p className="font-medium">Access Your Dashboard</p>
                    <p className="text-muted-foreground text-sm">Upon successful login, you'll be redirected to your personalized dashboard</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Dashboard Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    3. Dashboard Overview
                    <Badge>Main Hub</Badge>
                  </CardTitle>
                  <CardDescription>Your central control panel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The dashboard provides a comprehensive view of your laundry activities:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Active Orders
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">View orders currently in progress</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Completed Orders
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Track your order history</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    Loyalty Points
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Earn and redeem reward points</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Saved Addresses
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Manage pickup and delivery locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Creating Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <PlusCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    4. Creating a New Order
                    <Badge variant="secondary">Essential</Badge>
                  </CardTitle>
                  <CardDescription>Schedule your laundry pickup</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                  <div>
                    <p className="font-medium">Select Service Type</p>
                    <p className="text-muted-foreground text-sm">Choose from Wash & Fold, Dry Cleaning, Ironing, or Premium services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                  <div>
                    <p className="font-medium">Set Pickup Details</p>
                    <p className="text-muted-foreground text-sm">Select pickup date, time, and address</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                  <div>
                    <p className="font-medium">Add Special Instructions</p>
                    <p className="text-muted-foreground text-sm">Include any specific care instructions for your garments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">4</div>
                  <div>
                    <p className="font-medium">Confirm & Submit</p>
                    <p className="text-muted-foreground text-sm">Review your order and confirm to schedule pickup</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Order History */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <History className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    5. Order History
                    <Badge variant="outline">Track</Badge>
                  </CardTitle>
                  <CardDescription>View and manage past orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access your complete order history to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>View all past and current orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Track order status in real-time</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Reorder from previous orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Download receipts and invoices</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Rewards */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    6. Rewards Program
                    <Badge className="bg-yellow-500/10 text-yellow-600">Bonus</Badge>
                  </CardTitle>
                  <CardDescription>Earn points with every order</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our loyalty program rewards you for your continued patronage:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">10</p>
                  <p className="text-sm text-muted-foreground">Points per ₦1,000 spent</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">500</p>
                  <p className="text-sm text-muted-foreground">Points = ₦500 discount</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">2x</p>
                  <p className="text-sm text-muted-foreground">Points on Premium services</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500/10 rounded-lg">
                  <Settings className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    7. Account Settings
                    <Badge variant="outline">Manage</Badge>
                  </CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Manage your account preferences and personal information:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Update profile information</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Manage notification preferences</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Add or edit delivery addresses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Change password and security settings</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="bg-muted p-6 rounded-lg text-center">
            <h3 className="font-semibold text-lg">Need Help?</h3>
            <p className="text-muted-foreground mt-2">
              Contact our support team at <span className="text-primary font-medium">support@udclaundry.com</span>
            </p>
            <p className="text-muted-foreground">
              Or call us at <span className="text-primary font-medium">+234 800 123 4567</span>
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserGuide;
