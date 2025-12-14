import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bell, Mail, MessageSquare, Moon, Globe, AlertCircle, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  order_updates: boolean;
  promotional_emails: boolean;
  theme: string;
  language: string;
}

const defaultSettings: UserSettings = {
  email_notifications: true,
  sms_notifications: false,
  push_notifications: true,
  order_updates: true,
  promotional_emails: false,
  theme: "system",
  language: "en",
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    let isMounted = true;

    const loadSettings = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (fetchError) throw fetchError;

        if (data) {
          setSettings({
            email_notifications: data.email_notifications,
            sms_notifications: data.sms_notifications,
            push_notifications: data.push_notifications,
            order_updates: data.order_updates,
            promotional_emails: data.promotional_emails,
            theme: data.theme,
            language: data.language,
          });
        } else {
          // Create default settings for user
          const { error: insertError } = await supabase
            .from("user_settings")
            .insert([{ user_id: user.id, ...defaultSettings }]);

          if (!isMounted) return;
          if (insertError) throw insertError;
          setSettings(defaultSettings);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error loading settings:", err);
          setError("Failed to load settings. Please refresh the page.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadSettings();
    
    return () => {
      isMounted = false;
    };
  }, [user, navigate]);

  const updateSetting = async (key: keyof UserSettings, value: boolean | string) => {
    if (!user) return;

    const previousSettings = { ...settings };
    setSettings((prev) => ({ ...prev, [key]: value }));

    try {
      const { error: updateError } = await supabase
        .from("user_settings")
        .update({ [key]: value })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setSettings(previousSettings);
      toast({
        title: "Update failed",
        description: "Could not save your settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      // Sign out and let them know to contact support for full deletion
      await signOut();
      toast({
        title: "Signed out",
        description: "Please contact support to complete account deletion.",
      });
      navigate("/");
    } catch (err: any) {
      console.error("Error during account deletion:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email_notifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => updateSetting("email_notifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms_notifications" className="text-base">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get text messages for order updates
                      </p>
                    </div>
                    <Switch
                      id="sms_notifications"
                      checked={settings.sms_notifications}
                      onCheckedChange={(checked) => updateSetting("sms_notifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push_notifications" className="text-base">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => updateSetting("push_notifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order_updates" className="text-base">
                        Order Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your order status changes
                      </p>
                    </div>
                    <Switch
                      id="order_updates"
                      checked={settings.order_updates}
                      onCheckedChange={(checked) => updateSetting("order_updates", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotional_emails" className="text-base">
                        Promotional Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive offers and discount notifications
                      </p>
                    </div>
                    <Switch
                      id="promotional_emails"
                      checked={settings.promotional_emails}
                      onCheckedChange={(checked) => updateSetting("promotional_emails", checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting("theme", value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Language
              </CardTitle>
              <CardDescription>Set your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                      <SelectItem value="yo">Yoruba</SelectItem>
                      <SelectItem value="ig">Igbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleting ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;