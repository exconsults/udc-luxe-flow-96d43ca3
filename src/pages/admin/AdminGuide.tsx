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
  BookOpen,
  Settings,
  Mail,
  Database,
  Lock,
  FileText,
  TrendingUp,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  Search,
  Filter,
  Calendar,
  Clock,
  Truck,
  XCircle
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

  // Access check handled by AdminLayout - just show loading state if needed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <p className="text-muted-foreground mt-1">Complete administrative operations guide for UDC Dry Cleaning management</p>
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
                Watch comprehensive guides for administrative operations. These tutorials cover everything from 
                basic dashboard navigation to advanced order management and user role assignments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <VideoTutorial
                  title="Admin Dashboard Overview"
                  description="Navigate the admin dashboard, understand key metrics, and learn about the analytics overview and quick action buttons"
                  duration="4:30"
                  placeholder
                />
                <VideoTutorial
                  title="Managing Customer Orders"
                  description="Process orders, update status through the workflow, add staff notes, and send customer notifications effectively"
                  duration="6:15"
                  placeholder
                />
                <VideoTutorial
                  title="User Management & Roles"
                  description="Assign admin, moderator, and user roles. Understand permission levels and how to manage user access securely"
                  duration="5:00"
                  placeholder
                />
                <VideoTutorial
                  title="Revenue & Transaction Reports"
                  description="Track payments, view transaction history, generate financial reports, and understand the payment reconciliation process"
                  duration="4:45"
                  placeholder
                />
                <VideoTutorial
                  title="Email Notification System"
                  description="Configure automated customer emails, customize templates, and monitor email delivery status for order updates"
                  duration="3:20"
                  placeholder
                />
                <VideoTutorial
                  title="Security Best Practices"
                  description="Maintain system security, handle sensitive customer data, implement access controls, and respond to security concerns"
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
                <h1 className="text-2xl font-bold">UDC Dry Cleaning Service</h1>
                <p className="text-primary-foreground/80 mt-1">Administrator Operations Guide</p>
                <p className="text-primary-foreground/60 text-sm mt-2">Complete reference for managing the UDC platform</p>
              </div>

              {/* Introduction */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Welcome, Administrator</CardTitle>
                      <CardDescription>Your guide to managing UDC Dry Cleaning operations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    As an administrator, you have full access to manage all aspects of the UDC Dry Cleaning platform. 
                    This guide will walk you through every feature and function available to you, from processing customer 
                    orders to managing user accounts and monitoring business performance.
                  </p>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span><strong>Important:</strong> Admin access grants significant control over the system. Always follow security best practices and be cautious when making changes that affect customer data or system configuration.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

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
                      <CardDescription>Central control for all business operations and analytics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The admin dashboard provides comprehensive oversight of all business operations. It's designed to give 
                    you instant visibility into key metrics, pending actions, and overall system health at a glance.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        Total Users
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Monitor registered user count, new signups, and user growth trends over time. Track customer acquisition.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-purple-500" />
                        Total Orders
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Track all orders across the platform including pending, active, and completed. View daily/weekly/monthly breakdowns.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Revenue Metrics
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">View total revenue, pending payments, average order value, and revenue growth. Generate financial reports.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-500" />
                        Active Orders
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Orders currently in progress requiring attention. Quick access to manage workflow and resolve issues.</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Dashboard Best Practices
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Check the dashboard at the start of each business day</li>
                      <li>• Review pending orders and prioritize by pickup date</li>
                      <li>• Monitor revenue metrics weekly for trend analysis</li>
                      <li>• Address any flagged issues immediately</li>
                    </ul>
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
                      <CardDescription>Process, track, and manage all customer orders efficiently</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Order management is the core of your daily operations. This section covers everything from viewing 
                    orders to updating status, handling special requests, and communicating with customers.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          View & Search Orders
                        </p>
                        <p className="text-muted-foreground text-sm">Access the complete order list with powerful search and filtering. Search by order number, customer name, email, or phone. Filter by status, date range, or service type.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Update Order Status
                        </p>
                        <p className="text-muted-foreground text-sm">Progress orders through the workflow. Each status change triggers automatic customer notification via email, keeping them informed throughout the process.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Add Staff Notes
                        </p>
                        <p className="text-muted-foreground text-sm">Document special handling requirements, stain treatment notes, customer preferences, or any issues. Staff notes are visible to all team members but not to customers.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">4</div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule Delivery
                        </p>
                        <p className="text-muted-foreground text-sm">Set or update delivery dates and time slots. Coordinate with drivers and ensure timely delivery to customers.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium shrink-0">5</div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Handle Cancellations
                        </p>
                        <p className="text-muted-foreground text-sm">Process order cancellations when requested. Cancel orders can only be done before pickup. Document cancellation reasons for reporting.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Complete Order Status Workflow:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Draft', 'Scheduled', 'Picked Up', 'Washing', 'Drying', 'Folding', 'Ready', 'Out for Delivery', 'Delivered'].map((status, index, arr) => (
                        <span key={status} className="flex items-center gap-1">
                          <Badge variant="outline">{status}</Badge>
                          {index < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Cancelled</strong> status can be applied at any point before "Picked Up" upon customer request.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                      <span><strong>Automatic Notifications:</strong> Every status change automatically sends an email to the customer with their order details and current status. This keeps customers informed without manual intervention.</span>
                    </p>
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
                      <CardDescription>Manage user accounts, assign roles, and control access permissions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    User management allows you to control who has access to what within the system. Proper role 
                    assignment is crucial for security and operational efficiency.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">1</div>
                      <div>
                        <p className="font-medium">View All Users</p>
                        <p className="text-muted-foreground text-sm">Access the complete user directory with profile information, registration date, order history summary, and current role assignments. Search and filter users easily.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">2</div>
                      <div>
                        <p className="font-medium">Assign User Roles</p>
                        <p className="text-muted-foreground text-sm">Grant elevated permissions by assigning admin or moderator roles. Each role provides different levels of access to system features. Only admins can assign other admins.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">3</div>
                      <div>
                        <p className="font-medium">Remove Roles</p>
                        <p className="text-muted-foreground text-sm">Revoke elevated permissions when no longer needed or for security reasons. Users will retain their standard customer access after role removal.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium shrink-0">4</div>
                      <div>
                        <p className="font-medium">View User Activity</p>
                        <p className="text-muted-foreground text-sm">Monitor user engagement including order history, loyalty points, referral activity, and last login timestamp.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Role Permissions Breakdown:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Badge className="bg-red-500/10 text-red-600 shrink-0">Admin</Badge>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">Full System Access</p>
                          <ul className="mt-1 space-y-0.5">
                            <li>• View and manage all orders</li>
                            <li>• Access user management and role assignment</li>
                            <li>• View revenue and financial reports</li>
                            <li>• Assign/remove other admin roles</li>
                            <li>• Access system settings and configuration</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-blue-500/10 text-blue-600 shrink-0">Moderator</Badge>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">Limited Admin Access</p>
                          <ul className="mt-1 space-y-0.5">
                            <li>• View and manage orders</li>
                            <li>• Update order status</li>
                            <li>• View customer information</li>
                            <li>• Cannot access user role management</li>
                            <li>• Cannot view financial reports</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-gray-500/10 text-gray-600 shrink-0">User</Badge>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">Customer Access Only</p>
                          <ul className="mt-1 space-y-0.5">
                            <li>• Create and manage own orders</li>
                            <li>• View personal order history</li>
                            <li>• Manage own profile and addresses</li>
                            <li>• Access rewards and referral program</li>
                          </ul>
                        </div>
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
                      <CardDescription>Monitor business finances, track payments, and generate reports</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The financial section gives you complete visibility into your business performance. Track revenue, 
                    monitor transactions, and generate reports for accounting and business planning.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>Total Revenue:</strong> View cumulative revenue from all completed orders with breakdown by service type</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>Pending Payments:</strong> Track outstanding balances and orders awaiting payment confirmation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>Transaction History:</strong> Complete log of all payments with date, amount, payment method, and status</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>Revenue Trends:</strong> Daily, weekly, and monthly charts showing business growth and patterns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><strong>Export Reports:</strong> Download financial data in CSV or PDF format for accounting software</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">Financial Best Practices</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Reconcile transactions daily to catch discrepancies early</li>
                      <li>• Export monthly reports for your accountant</li>
                      <li>• Monitor pending payments and follow up after 7 days</li>
                      <li>• Review revenue trends to identify peak periods</li>
                    </ul>
                  </div>
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
                        5. Email Notification System
                        <Badge variant="secondary">Communication</Badge>
                      </CardTitle>
                      <CardDescription>Configure and monitor automated customer communications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The email notification system keeps customers informed throughout their order journey. Understanding 
                    how notifications work helps you provide better customer service.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Automatic Email Triggers
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0 text-xs">Order Created</Badge>
                          <span>Confirmation email with order details and estimated pickup time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0 text-xs">Status Change</Badge>
                          <span>Update email sent whenever order status progresses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0 text-xs">Ready for Delivery</Badge>
                          <span>Notification when order is ready with delivery schedule</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0 text-xs">Delivered</Badge>
                          <span>Delivery confirmation with receipt and feedback request</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        Monitoring Email Delivery
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Check the email logs to verify delivery status. If customers report not receiving emails, 
                        verify their email address is correct and check spam folder recommendations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 6: Security */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <Lock className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        6. Security Best Practices
                        <Badge className="bg-red-500/10 text-red-600">Important</Badge>
                      </CardTitle>
                      <CardDescription>Protect customer data and maintain system security</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    As an administrator, you have access to sensitive customer information. Following security best 
                    practices is essential to protect customer privacy and maintain trust.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-medium mb-2 text-red-700 dark:text-red-300 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Critical Security Rules
                      </h4>
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        <li>• Never share your admin credentials with anyone</li>
                        <li>• Always log out when leaving your workstation</li>
                        <li>• Do not access the admin panel on public computers</li>
                        <li>• Report any suspicious activity immediately</li>
                        <li>• Never export customer data without authorization</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        Data Handling Guidelines
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Only access customer data when necessary for service</li>
                        <li>• Do not copy customer information to personal devices</li>
                        <li>• Customer phone numbers and addresses are confidential</li>
                        <li>• Transaction details should only be shared with authorized personnel</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Access Control
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Regularly review user roles and remove unnecessary access</li>
                        <li>• Only assign admin roles to trusted, trained personnel</li>
                        <li>• Document all role changes for audit purposes</li>
                        <li>• Immediately revoke access for departing staff members</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 7: Daily Operations Checklist */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                      <FileText className="h-6 w-6 text-teal-500" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        7. Daily Operations Checklist
                        <Badge variant="outline">Workflow</Badge>
                      </CardTitle>
                      <CardDescription>Recommended daily routine for efficient operations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Follow this daily checklist to ensure smooth operations and excellent customer service.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Morning (Start of Business)
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>□ Review dashboard for overnight orders</li>
                        <li>□ Check scheduled pickups for the day</li>
                        <li>□ Review any pending issues from previous day</li>
                        <li>□ Confirm driver schedules and routes</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        Throughout the Day
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>□ Update order statuses as work progresses</li>
                        <li>□ Respond to customer inquiries promptly</li>
                        <li>□ Monitor for any delivery delays</li>
                        <li>□ Process new orders as they come in</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        End of Day
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>□ Confirm all scheduled deliveries completed</li>
                        <li>□ Review tomorrow's pickup schedule</li>
                        <li>□ Update any pending order notes</li>
                        <li>□ Check revenue summary for the day</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-lg text-center">
                <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Thank you for being part of the UDC Dry Cleaning administrative team. Your dedication to excellence 
                  helps us deliver outstanding service to our customers.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  For technical support or questions about this guide, contact the system administrator.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  © 2024 UDC Dry Cleaning. All rights reserved. | Admin Guide v2.0
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
