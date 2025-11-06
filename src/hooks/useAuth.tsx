import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { offlineStorage } from "@/lib/offline-storage";
import { syncService } from "@/lib/sync-service";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnline: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init();

    // Handle online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Syncing your data...",
      });
      syncService.syncAll();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Changes will sync when you're back online",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Cache session offline
          await offlineStorage.saveAuth('session', session);
          // Start auto sync
          syncService.startAutoSync();

          // Fetch and cache profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            await offlineStorage.saveProfile({
              id: profile.id,
              email: profile.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              phone: profile.phone,
              role: profile.role,
              loyaltyPoints: profile.loyalty_points,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            });
          }
        } else {
          // Clear offline data on signout
          await offlineStorage.clearAuth();
          syncService.stopAutoSync();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // If no online session, try to load from cache
      if (!session && !navigator.onLine) {
        const cachedSession = await offlineStorage.getAuth('session');
        if (cachedSession) {
          setSession(cachedSession);
          setUser(cachedSession.user);
          toast({
            title: "Offline mode",
            description: "Using cached session",
          });
        }
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      syncService.stopAutoSync();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    if (!isOnline) {
      // Check cached credentials for offline login
      const cachedSession = await offlineStorage.getAuth('session');
      if (cachedSession && cachedSession.user.email === email) {
        setSession(cachedSession);
        setUser(cachedSession.user);
        toast({
          title: "Signed in (offline)",
          description: "Using cached credentials",
        });
        return;
      }
      throw new Error("Cannot sign in while offline without cached credentials");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: "Welcome back!",
      description: "You've successfully signed in",
    });
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => {
    if (!isOnline) {
      throw new Error("Cannot sign up while offline");
    }

    const redirectUrl = `${window.location.origin}/`;

const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) throw error;

    // Create or update profile row with user details
    if (data.user) {
      const profilePayload = {
        id: data.user.id,
        email: data.user.email ?? email,
        first_name: firstName,
        last_name: lastName,
        phone,
      } as const;

      // Use upsert to handle both new and existing users safely
      await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' });

      // Ensure a referral code exists immediately (non-blocking)
      try {
        await supabase.rpc('ensure_referral_code');
      } catch (e) {
        console.warn('ensure_referral_code RPC failed (non-blocking):', e);
      }
    }

    toast({
      title: "Account created!",
      description: "Welcome to UDC Laundry",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await offlineStorage.clearAuth();
    syncService.stopAutoSync();

    toast({
      title: "Signed out",
      description: "Come back soon!",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isOnline,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
