import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setError(null);

      // Prefer a tolerant query (works even if a user can have multiple roles)
      const { data, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (!rolesError) {
        const admin = (data ?? []).some((r) => r.role === 'admin');
        setIsAdmin(admin);
        return;
      }

      // Fallback: use backend role checker (can be more reliable under complex RLS)
      console.warn('Direct role query failed; falling back to has_role RPC:', rolesError);
      const { data: hasRole, error: rpcError } = await supabase.rpc('has_role', {
        _role: 'admin',
        _user_id: user.id,
      });

      if (rpcError) {
        console.error('Error checking admin status via RPC:', rpcError);
        setError(rpcError.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(hasRole));
      }
    } catch (err) {
      console.error('Error in admin check:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  // Subscribe to user_roles changes for real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`admin-role-changes:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Re-check admin status when roles change
          checkAdminStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, checkAdminStatus]);

  // Function to manually refresh admin status
  const refreshAdminStatus = useCallback(() => {
    setIsLoading(true);
    checkAdminStatus();
  }, [checkAdminStatus]);

  return { isAdmin, isLoading, error, refreshAdminStatus };
};
