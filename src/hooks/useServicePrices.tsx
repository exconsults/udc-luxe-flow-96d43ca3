import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServicePrice {
  id: string;
  service_type: string;
  name: string;
  description: string | null;
  base_price: number;
  price_unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServicePrices = () => {
  return useQuery({
    queryKey: ['service-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_prices')
        .select('*')
        .eq('is_active', true)
        .order('service_type');
      
      if (error) throw error;
      return data as ServicePrice[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useAllServicePrices = () => {
  return useQuery({
    queryKey: ['all-service-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_prices')
        .select('*')
        .order('service_type');
      
      if (error) throw error;
      return data as ServicePrice[];
    },
  });
};

export const useUpdateServicePrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServicePrice> }) => {
      const { error } = await supabase
        .from('service_prices')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-prices'] });
      queryClient.invalidateQueries({ queryKey: ['all-service-prices'] });
    },
  });
};
