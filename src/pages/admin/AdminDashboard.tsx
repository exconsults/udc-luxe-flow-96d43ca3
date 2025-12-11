import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  UserCog,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

type AppRole = 'admin' | 'moderator' | 'user';
type OrderStatus = 'draft' | 'scheduled' | 'picked_up' | 'washing' | 'drying' | 'folding' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'washing', label: 'Washing' },
  { value: 'drying', label: 'Drying' },
  { value: 'folding', label: 'Folding' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  // Fetch all users (profiles)
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  // Fetch all user roles
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: isAdmin
  });

  // Fetch all orders
  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  // Fetch all transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  // Mutation to assign role
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast.success('Role assigned successfully');
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  });

  // Mutation to remove role
  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  });

  // Mutation to update order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, orderNumber, userId }: { orderId: string; status: OrderStatus; orderNumber: string; userId: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      // Get user email for notification
      const userProfile = users?.find(u => u.id === userId);
      if (userProfile?.email) {
        // Send email notification
        try {
          const { error: emailError } = await supabase.functions.invoke('send-order-status-email', {
            body: {
              orderId,
              newStatus: status,
              userEmail: userProfile.email,
              userName: userProfile.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim() : undefined,
              orderNumber
            }
          });
          if (emailError) {
            console.error('Email notification failed:', emailError);
          }
        } catch (emailErr) {
          console.error('Email notification error:', emailErr);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated and notification sent');
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  });

  const getUserRole = (userId: string): AppRole | null => {
    const role = userRoles?.find(r => r.user_id === userId);
    return role?.role || null;
  };

  const openRoleDialog = (userId: string, email: string, name: string) => {
    setSelectedUser({ id: userId, email, name });
    setSelectedRole(getUserRole(userId) || 'user');
    setIsRoleDialogOpen(true);
  };

  const handleAssignRole = () => {
    if (selectedUser) {
      assignRoleMutation.mutate({ userId: selectedUser.id, role: selectedRole });
    }
  };

  const handleRemoveRole = (userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot remove your own admin role");
      return;
    }
    removeRoleMutation.mutate(userId);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus, orderNumber: string, userId: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus, orderNumber, userId });
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = transactions?.reduce((sum, t) => t.status === 'completed' ? sum + Number(t.amount) : sum, 0) || 0;
  const pendingOrders = orders?.filter(o => !['delivered', 'cancelled'].includes(o.status)).length || 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground',
      scheduled: 'bg-blue-500/10 text-blue-500',
      picked_up: 'bg-purple-500/10 text-purple-500',
      washing: 'bg-cyan-500/10 text-cyan-500',
      drying: 'bg-orange-500/10 text-orange-500',
      folding: 'bg-yellow-500/10 text-yellow-500',
      ready: 'bg-emerald-500/10 text-emerald-500',
      out_for_delivery: 'bg-indigo-500/10 text-indigo-500',
      delivered: 'bg-green-500/10 text-green-500',
      cancelled: 'bg-destructive/10 text-destructive'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getRoleBadgeStyle = (role: AppRole | null) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'moderator':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'user':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getUserEmail = (userId: string) => {
    const userProfile = users?.find(u => u.id === userId);
    return userProfile?.email || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage users and orders</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            Admin
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {usersLoading ? <Skeleton className="h-8 w-16" /> : totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {ordersLoading ? <Skeleton className="h-8 w-16" /> : totalOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {transactionsLoading ? <Skeleton className="h-8 w-16" /> : `₦${totalRevenue.toLocaleString()}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {ordersLoading ? <Skeleton className="h-8 w-16" /> : pendingOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Update order statuses</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetchOrders()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.order_number}</TableCell>
                        <TableCell className="text-sm">{getUserEmail(order.user_id)}</TableCell>
                        <TableCell className="capitalize">
                          {order.service_type.replace('_', ' ')}
                        </TableCell>
                        <TableCell>₦{Number(order.total).toLocaleString()}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus, order.order_number, order.user_id)}
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            <SelectTrigger className={`w-[160px] h-8 text-xs ${getStatusColor(order.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.created_at), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>

        {/* Users Table with Role Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and assign roles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading || rolesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>System Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map(userItem => {
                      const role = getUserRole(userItem.id);
                      const isCurrentUser = userItem.id === user?.id;
                      return (
                        <TableRow key={userItem.id}>
                          <TableCell className="font-medium">
                            {userItem.first_name} {userItem.last_name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                            )}
                          </TableCell>
                          <TableCell>{userItem.email}</TableCell>
                          <TableCell>{userItem.phone || '-'}</TableCell>
                          <TableCell>
                            {role ? (
                              <Badge variant="outline" className={getRoleBadgeStyle(role)}>
                                {role}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No role</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(userItem.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openRoleDialog(
                                  userItem.id, 
                                  userItem.email, 
                                  `${userItem.first_name || ''} ${userItem.last_name || ''}`.trim()
                                )}
                              >
                                {role ? 'Change Role' : 'Assign Role'}
                              </Button>
                              {role && !isCurrentUser && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveRole(userItem.id)}
                                  disabled={removeRoleMutation.isPending}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedRole === 'admin' && 'Full access to admin dashboard and all management features.'}
              {selectedRole === 'moderator' && 'Can moderate content and assist with user management.'}
              {selectedRole === 'user' && 'Standard user access with no administrative privileges.'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={assignRoleMutation.isPending}>
              {assignRoleMutation.isPending ? 'Assigning...' : 'Assign Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
