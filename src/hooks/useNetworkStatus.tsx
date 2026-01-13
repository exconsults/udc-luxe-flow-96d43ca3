import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface NetworkStatusState {
  isOnline: boolean;
  lastOnline: Date | null;
}

// Store active channels for pause/resume functionality
const activeChannels: Set<RealtimeChannel> = new Set();

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatusState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastOnline: null,
  });

  const handleOnline = useCallback(() => {
    setStatus({ isOnline: true, lastOnline: new Date() });
    
    // Resume all active channels
    activeChannels.forEach((channel) => {
      channel.subscribe();
    });
  }, []);

  const handleOffline = useCallback(() => {
    setStatus((prev) => ({ ...prev, isOnline: false }));
    
    // Pause all active channels
    activeChannels.forEach((channel) => {
      channel.unsubscribe();
    });
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return status;
}

// Helper to register a channel for automatic pause/resume
export function registerRealtimeChannel(channel: RealtimeChannel): () => void {
  activeChannels.add(channel);
  
  return () => {
    activeChannels.delete(channel);
  };
}

// Hook for creating managed realtime subscriptions
export function useManagedRealtimeChannel(
  channelName: string,
  config: {
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    schema: string;
    table?: string;
    filter?: string;
  },
  callback: (payload: any) => void
) {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) return;

    const channel = supabase.channel(channelName);
    
    channel.on(
      'postgres_changes' as any,
      {
        event: config.event,
        schema: config.schema,
        table: config.table,
        filter: config.filter,
      } as any,
      callback
    ).subscribe();

    const unregister = registerRealtimeChannel(channel);

    return () => {
      unregister();
      supabase.removeChannel(channel);
    };
  }, [channelName, config.event, config.schema, config.table, config.filter, callback, isOnline]);
}
