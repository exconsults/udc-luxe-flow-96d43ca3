import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoTutorial from "@/components/VideoTutorial";
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
  Loader2,
  PlayCircle,
  BookOpen,
  Phone,
  Mail,
  HelpCircle,
  Shield,
  Truck,
  Sparkles,
  CreditCard,
  Gift,
  Star,
  MessageSquare,
  Bell
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
          <p className="text-muted-foreground mt-1">Complete guide to using UDC Dry Cleaning Service - Your trusted laundry partner</p>
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

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="guide" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Written Guide
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Video Tutorials
          </TabsTrigger>
        </TabsList>

        {/* Video Tutorials Tab */}
        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Watch step-by-step video guides to master UDC Dry Cleaning services. Each video is designed to help you get the most out of our platform with easy-to-follow instructions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <VideoTutorial
                  title="Getting Started with UDC"
                  description="Learn how to create your account, verify your email, and set up your profile with personal details and preferences"
                  duration="3:45"
                  placeholder
                />
                <VideoTutorial
                  title="Creating Your First Order"
                  description="Step-by-step guide to scheduling a laundry pickup, selecting services, and adding special care instructions"
                  duration="5:20"
                  placeholder
                />
                <VideoTutorial
                  title="Real-Time Order Tracking"
                  description="How to monitor your order status from pickup to delivery with our live tracking system"
                  duration="2:15"
                  placeholder
                />
                <VideoTutorial
                  title="Managing Multiple Addresses"
                  description="Add, edit, and manage your pickup and delivery locations for home, office, or any other address"
                  duration="2:45"
                  placeholder
                />
                <VideoTutorial
                  title="Maximizing Your Rewards"
                  description="Earn loyalty points, understand the rewards tiers, and redeem points for discounts on future orders"
                  duration="4:10"
                  placeholder
                />
                <VideoTutorial
                  title="Account & Notification Settings"
                  description="Customize your experience with notification preferences, theme settings, and profile updates"
                  duration="3:30"
                  placeholder
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Written Guide Tab */}
        <TabsContent value="guide">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div ref={contentRef} className="space-y-6 pr-4">
              {/* Header for PDF */}
              <div className="bg-primary text-primary-foreground p-6 rounded-lg text-center">
                <h1 className="text-2xl font-bold">UDC Dry Cleaning Service</h1>
                <p className="text-primary-foreground/80 mt-1">Complete User Guide - Everything You Need to Know</p>
                <p className="text-primary-foreground/60 text-sm mt-2">Professional laundry services at your fingertips</p>
              </div>

              {/* Welcome Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Welcome to UDC Dry Cleaning</CardTitle>
                      <CardDescription>Your premium laundry service partner</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    UDC Dry Cleaning is Nigeria's leading professional laundry and dry cleaning service. We combine 
                    cutting-edge technology with traditional care to deliver exceptional results for all your garments. 
                    Whether you need regular wash and fold, delicate dry cleaning, or premium garment care, our team 
                    of experienced professionals ensures your clothes are treated with the utmost care and attention.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        Free Pickup & Delivery
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">We come to you - schedule convenient pickup and delivery times that fit your busy lifestyle</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        Quality Guarantee
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Not satisfied? We'll re-clean your items free of charge or provide a full refund</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <CardDescription>Register to access all our premium services and exclusive member benefits</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Creating an account takes less than 2 minutes and gives you access to our full range of services, 
                    order tracking, loyalty rewards, and personalized recommendations.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">1</div>
                      <div>
                        <p className="font-medium">Visit the Registration Page</p>
                        <p className="text-muted-foreground text-sm">Click on "Sign Up" or "Get Started" button on the homepage. You'll be redirected to our secure registration form.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">2</div>
                      <div>
                        <p className="font-medium">Enter Your Details</p>
                        <p className="text-muted-foreground text-sm">Provide your email address and create a secure password (minimum 8 characters with at least one number and special character for security).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">3</div>
                      <div>
                        <p className="font-medium">Complete Your Profile</p>
                        <p className="text-muted-foreground text-sm">Add your full name, phone number (for delivery updates), and your primary delivery address. You can add multiple addresses later for home, office, etc.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">4</div>
                      <div>
                        <p className="font-medium">Verify Your Email</p>
                        <p className="text-muted-foreground text-sm">Check your inbox for a verification email. Click the link to activate your account and start ordering immediately.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <Gift className="h-4 w-4 mt-0.5 shrink-0" />
                      <span><strong>Welcome Bonus:</strong> New members receive 50 loyalty points upon registration - that's ₦500 towards your first order!</span>
                    </p>
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
                      <CardDescription>Access your account securely from any device</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Log in to manage your orders, track deliveries, and access your personalized dashboard with order history and rewards.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                      <div>
                        <p className="font-medium">Go to Login Page</p>
                        <p className="text-muted-foreground text-sm">Click "Sign In" on the homepage or navigation menu. The login page works on all devices - desktop, tablet, and mobile.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                      <div>
                        <p className="font-medium">Enter Credentials</p>
                        <p className="text-muted-foreground text-sm">Use your registered email and password to sign in. Enable "Remember Me" to stay logged in on trusted devices.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                      <div>
                        <p className="font-medium">Access Your Dashboard</p>
                        <p className="text-muted-foreground text-sm">Upon successful login, you'll be redirected to your personalized dashboard showing active orders, recent activity, and quick actions.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span><strong>Forgot Password?</strong> Click "Forgot Password" on the login page and we'll send you a secure reset link to your email within seconds.</span>
                    </p>
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
                      <CardDescription>Your central control panel for managing all laundry activities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The dashboard is your personal command center. It provides a comprehensive view of your laundry activities, 
                    quick actions, and important notifications all in one place. The intuitive design ensures you can manage 
                    everything with just a few clicks.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Active Orders
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">View orders currently in progress with real-time status updates. Track from pickup to delivery.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Completed Orders
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Access your complete order history. Re-order with one click or download invoices.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        Loyalty Points
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Track your points balance, view earning history, and redeem rewards for discounts.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        Saved Addresses
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Manage multiple pickup and delivery locations - home, office, or any address you need.</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      Dashboard Notifications
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your dashboard displays real-time notifications for order updates, promotional offers, and important 
                      announcements. Never miss when your laundry is ready for delivery!
                    </p>
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
                      <CardDescription>Schedule your laundry pickup in under 2 minutes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Creating an order is simple and straightforward. Our step-by-step process guides you through selecting 
                    services, scheduling pickup, and adding any special care instructions for your garments.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                      <div>
                        <p className="font-medium">Select Service Type</p>
                        <p className="text-muted-foreground text-sm">Choose from our service options:</p>
                        <ul className="text-muted-foreground text-sm mt-1 ml-4 list-disc space-y-1">
                          <li><strong>Wash & Fold:</strong> Everyday laundry washed, dried, and neatly folded</li>
                          <li><strong>Dry Cleaning:</strong> Professional cleaning for delicate fabrics and formal wear</li>
                          <li><strong>Ironing:</strong> Crisp, wrinkle-free pressing for professional appearance</li>
                          <li><strong>Premium:</strong> White-glove service with stain treatment and hand finishing</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                      <div>
                        <p className="font-medium">Set Pickup Details</p>
                        <p className="text-muted-foreground text-sm">Select your preferred pickup date and time window. Choose from your saved addresses or add a new location. We offer flexible time slots from 7 AM to 9 PM.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                      <div>
                        <p className="font-medium">Add Special Instructions</p>
                        <p className="text-muted-foreground text-sm">Include any specific care instructions - stain locations, fabric sensitivities, preferred detergent, folding preferences, or items needing extra attention.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">4</div>
                      <div>
                        <p className="font-medium">Confirm & Submit</p>
                        <p className="text-muted-foreground text-sm">Review your order summary including estimated pricing, then confirm to schedule your pickup. You'll receive an instant confirmation via email and SMS.</p>
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
                        5. Order History & Tracking
                        <Badge variant="outline">Track</Badge>
                      </CardTitle>
                      <CardDescription>View, track, and manage all your orders in one place</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Access your complete order history to track current orders, review past services, and quickly reorder. 
                    Our tracking system keeps you informed at every step of the process.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>View all past and current orders with detailed status information</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Track order status in real-time: Scheduled → Picked Up → Washing → Drying → Folding → Ready → Delivered</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>One-click reorder from previous orders - perfect for regular laundry schedules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Download receipts and invoices for expense tracking or reimbursement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Filter orders by date, status, or service type for easy navigation</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Order Status Flow:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Scheduled', 'Picked Up', 'Washing', 'Drying', 'Folding', 'Ready', 'Out for Delivery', 'Delivered'].map((status, index, arr) => (
                        <span key={status} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{status}</Badge>
                          {index < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
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
                      <CardDescription>Earn points with every order and unlock exclusive benefits</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Our loyalty program rewards you for your continued patronage. The more you use UDC Dry Cleaning, 
                    the more you save! Points never expire as long as your account remains active.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-medium">Earn Points</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Get 10 points for every ₦1,000 spent on services. Bonus points on special promotions!</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Redeem Rewards</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Use points for discounts: 100 points = ₦1,000 off your next order. Redeem anytime!</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Refer Friends</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Share your referral code and earn 100 bonus points when friends sign up and order!</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      VIP Membership Tiers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Bronze:</span> 0-499 points
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-yellow-600">Silver:</span> 500-999 points (5% bonus)
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-amber-600">Gold:</span> 1000+ points (10% bonus)
                      </div>
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
                        <Badge variant="outline">Customize</Badge>
                      </CardTitle>
                      <CardDescription>Personalize your experience and manage your preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Take control of your account with comprehensive settings. Update your profile, manage notifications, 
                    and customize the app to work exactly how you want it.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-primary" />
                        Notification Preferences
                      </h4>
                      <p className="text-sm text-muted-foreground">Choose how you want to receive updates:</p>
                      <ul className="text-sm text-muted-foreground mt-2 ml-4 list-disc space-y-1">
                        <li>Email notifications for order confirmations and receipts</li>
                        <li>SMS alerts for pickup and delivery updates</li>
                        <li>Push notifications for real-time order status changes</li>
                        <li>Promotional emails for exclusive offers and discounts</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Settings className="h-4 w-4 text-primary" />
                        App Preferences
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Switch between light and dark themes</li>
                        <li>• Change language preferences</li>
                        <li>• Manage saved addresses</li>
                        <li>• Update profile information and password</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 8: Support */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-teal-500" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        8. Getting Help & Support
                        <Badge variant="secondary">Support</Badge>
                      </CardTitle>
                      <CardDescription>We're here to help you 24/7</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Have questions or need assistance? Our dedicated support team is always ready to help. 
                    Reach out through any of these channels:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        Phone Support
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Call us at +234 XXX XXX XXXX</p>
                      <p className="text-xs text-muted-foreground">Available Mon-Sat, 8 AM - 8 PM</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email Support
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">support@udclaundry.com</p>
                      <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        Live Chat
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Chat with us in-app</p>
                      <p className="text-xs text-muted-foreground">Instant responses during business hours</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-orange-500" />
                        Help Center
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Browse our FAQ section</p>
                      <p className="text-xs text-muted-foreground">Find answers to common questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <p className="text-muted-foreground">
                  Thank you for choosing UDC Dry Cleaning! We're committed to providing you with the best laundry experience.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  © 2024 UDC Dry Cleaning. All rights reserved.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserGuide;
