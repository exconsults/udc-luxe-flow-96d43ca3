import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import VideoTutorial from "@/components/VideoTutorial";
import { 
  Download, 
  Users, 
  ClipboardList, 
  DollarSign, 
  ShieldCheck,
  UserCog,
  Package,
  Bell,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  PlayCircle,
  BookOpen
} from "lucide-react";
import html2pdf from "html2pdf.js";

const AdminGuide = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminCheck();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const element = contentRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'UDC-Laundry-Admin-Guide.pdf',
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Guide</h1>
            <p className="text-muted-foreground mt-1">Complete administrative operations guide</p>
          </div>
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
                Admin Video Tutorials
              </CardTitle>
              <CardDescription>
                Watch comprehensive guides for administrative operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <VideoTutorial
                  title="Admin Dashboard Overview"
                  description="Navigate the admin dashboard and understand key metrics"
                  duration="4:30"
                  placeholder
                />
                <VideoTutorial
                  title="Managing Orders"
                  description="Process, update status, and manage customer orders"
                  duration="6:15"
                  placeholder
                />
                <VideoTutorial
                  title="User Management"
                  description="Assign roles and manage user permissions"
                  duration="5:00"
                  placeholder
                />
                <VideoTutorial
                  title="Revenue & Transactions"
                  description="Track payments and generate financial reports"
                  duration="4:45"
                  placeholder
                />
                <VideoTutorial
                  title="Email Notifications"
                  description="Configure and monitor automated customer emails"
                  duration="3:20"
                  placeholder
                />
                <VideoTutorial
                  title="Security Best Practices"
                  description="Maintain security and handle sensitive data"
                  duration="5:30"
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
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold">UDC Laundry Service</h1>
                <p className="text-primary-foreground/80 mt-1">Administrator Operations Guide</p>
          </div>

          {/* Section 1: Dashboard Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    1. Admin Dashboard Overview
                    <Badge>Main Hub</Badge>
                  </CardTitle>
                  <CardDescription>Central control for all operations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The admin dashboard provides comprehensive oversight of all business operations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Total Users
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Monitor registered user count and growth</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-purple-500" />
                    Total Orders
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Track all orders across the platform</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Revenue Metrics
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">View total and pending revenue</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    Active Orders
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Orders currently in progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Order Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    2. Order Management
                    <Badge variant="secondary">Essential</Badge>
                  </CardTitle>
                  <CardDescription>Process and manage customer orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                  <div>
                    <p className="font-medium">View All Orders</p>
                    <p className="text-muted-foreground text-sm">Access the complete list of orders with filtering and search capabilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                  <div>
                    <p className="font-medium">Update Order Status</p>
                    <p className="text-muted-foreground text-sm">Change order status from: Draft → Scheduled → Picked Up → Washing → Drying → Folding → Ready → Delivered</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                  <div>
                    <p className="font-medium">Approve Orders</p>
                    <p className="text-muted-foreground text-sm">Review and approve scheduled orders, set estimated delivery dates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">4</div>
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-muted-foreground text-sm">Customers automatically receive email updates when order status changes</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Order Status Flow:</h4>
                <div className="flex flex-wrap gap-2">
                  {['Draft', 'Scheduled', 'Picked Up', 'Washing', 'Drying', 'Folding', 'Ready', 'Out for Delivery', 'Delivered'].map((status, index, arr) => (
                    <span key={status} className="flex items-center gap-1">
                      <Badge variant="outline">{status}</Badge>
                      {index < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <UserCog className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    3. User Management
                    <Badge>Critical</Badge>
                  </CardTitle>
                  <CardDescription>Manage users and assign roles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                  <div>
                    <p className="font-medium">View All Users</p>
                    <p className="text-muted-foreground text-sm">Access the complete user list with profile information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                  <div>
                    <p className="font-medium">Assign User Roles</p>
                    <p className="text-muted-foreground text-sm">Grant admin, moderator, or user roles to control access levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                  <div>
                    <p className="font-medium">Remove Roles</p>
                    <p className="text-muted-foreground text-sm">Revoke roles when necessary for security purposes</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Available Roles:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/10 text-red-600">Admin</Badge>
                    <span className="text-sm text-muted-foreground">Full access to all features and settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/10 text-blue-600">Moderator</Badge>
                    <span className="text-sm text-muted-foreground">Can manage orders but limited admin access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-500/10 text-gray-600">User</Badge>
                    <span className="text-sm text-muted-foreground">Standard customer access</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Revenue Tracking */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    4. Revenue & Transactions
                    <Badge variant="outline">Financial</Badge>
                  </CardTitle>
                  <CardDescription>Monitor business finances</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Track all financial metrics and transactions:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>View total revenue from completed orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Track pending payments and outstanding balances</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Monitor transaction history and payment status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Generate financial reports and summaries</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Bell className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    5. Customer Notifications
                    <Badge variant="secondary">Communication</Badge>
                  </CardTitle>
                  <CardDescription>Automated email system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The system automatically sends email notifications to customers when:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Order is approved and confirmed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Order status changes (picked up, washing, ready, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Order is out for delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Order is delivered successfully</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Best Practices */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    6. Best Practices & Security
                    <Badge className="bg-yellow-500/10 text-yellow-600">Important</Badge>
                  </CardTitle>
                  <CardDescription>Guidelines for safe operations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                  <h4 className="font-medium text-yellow-600 mb-2">⚠️ Security Guidelines</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Never share your admin credentials with unauthorized personnel</li>
                    <li>• Regularly review user roles and remove unnecessary privileges</li>
                    <li>• Log out of the admin panel when not in use</li>
                    <li>• Report any suspicious activity immediately</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                  <h4 className="font-medium text-green-600 mb-2">✓ Operational Tips</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Process orders promptly to maintain customer satisfaction</li>
                    <li>• Update order status in real-time for accurate tracking</li>
                    <li>• Review pending orders daily to avoid delays</li>
                    <li>• Use the approval dialog to set realistic delivery estimates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg text-center">
            <h3 className="font-semibold text-lg">Admin Support</h3>
            <p className="text-muted-foreground mt-2">
              For technical assistance, contact <span className="text-primary font-medium">admin@udclaundry.com</span>
            </p>
            <p className="text-muted-foreground">
              Emergency Line: <span className="text-primary font-medium">+234 800 ADMIN (23646)</span>
            </p>
          </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGuide;
