// Background sync service for offline-first functionality

import { supabase } from "@/integrations/supabase/client";
import { offlineStorage, SyncQueueItem, OfflineOrder } from "./offline-storage";
import { v4 as uuidv4 } from 'uuid';

class SyncService {
  private syncInProgress = false;
  private syncInterval: NodeJS.Timeout | null = null;

  // Start automatic background sync
  startAutoSync(intervalMs: number = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMs);

    // Initial sync
    this.syncAll();
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Check if online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Sync all pending changes
  async syncAll(): Promise<void> {
    if (!this.isOnline() || this.syncInProgress) {
      // Only log once per minute to reduce noise
      return;
    }

    this.syncInProgress = true;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Sync skipped: no user session');
        return;
      }

      console.log('Starting sync...');
      const pendingItems = await offlineStorage.getPendingSyncItems(user.id);

      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          await offlineStorage.markSynced(item.id);
          console.log(`Synced item: ${item.id}`);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }

      // Sync orders from server to local
      await this.syncOrdersFromServer(user.id);

      console.log('Sync completed');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync individual item
  private async syncItem(item: SyncQueueItem): Promise<void> {
    const { tableName, actionType, data } = item;

    switch (actionType) {
      case 'create':
        if (tableName === 'orders') {
          await supabase.from('orders').insert(data);
        }
        break;
      case 'update':
        if (tableName === 'orders') {
          await supabase.from('orders').update(data).eq('id', item.recordId);
        }
        break;
      case 'delete':
        if (tableName === 'orders') {
          await supabase.from('orders').delete().eq('id', item.recordId);
        }
        break;
    }
  }

  // Sync orders from server to local
  private async syncOrdersFromServer(userId: string): Promise<void> {
    const { data: serverOrders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch orders from server:', error);
      return;
    }

    if (serverOrders) {
      for (const order of serverOrders) {
        const offlineOrder: OfflineOrder = {
          id: order.id,
          userId: order.user_id,
          orderNumber: order.order_number,
          serviceType: order.service_type,
          status: order.status,
          weightLbs: order.weight_lbs,
          itemCount: order.item_count,
          pickupDate: order.pickup_date,
          pickupTime: order.pickup_time,
          deliveryDate: order.delivery_date,
          deliveryTime: order.delivery_time,
          specialInstructions: order.special_instructions,
          subtotal: order.subtotal ? parseFloat(order.subtotal.toString()) : 0,
          tax: order.tax ? parseFloat(order.tax.toString()) : 0,
          total: order.total ? parseFloat(order.total.toString()) : 0,
          isSynced: true,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        };

        await offlineStorage.saveOrder(offlineOrder);
      }
    }
  }

  // Create order (works offline and online)
  async createOrder(orderData: Partial<OfflineOrder>): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const orderId = uuidv4();
    const now = new Date().toISOString();

    const order: OfflineOrder = {
      id: orderId,
      userId: user.id,
      serviceType: orderData.serviceType || 'wash_fold',
      status: orderData.status || 'draft',
      weightLbs: orderData.weightLbs,
      itemCount: orderData.itemCount,
      pickupDate: orderData.pickupDate,
      pickupTime: orderData.pickupTime,
      deliveryDate: orderData.deliveryDate,
      deliveryTime: orderData.deliveryTime,
      specialInstructions: orderData.specialInstructions,
      subtotal: orderData.subtotal || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      isSynced: false,
      createdAt: now,
      updatedAt: now,
    };

    // Save locally
    await offlineStorage.saveOrder(order);

    // Add to sync queue
    const syncItem: SyncQueueItem = {
      id: uuidv4(),
      userId: user.id,
      actionType: 'create',
      tableName: 'orders',
      recordId: orderId,
      data: {
        id: orderId,
        user_id: user.id,
        service_type: order.serviceType,
        status: order.status,
        weight_lbs: order.weightLbs,
        item_count: order.itemCount,
        pickup_date: order.pickupDate,
        pickup_time: order.pickupTime,
        delivery_date: order.deliveryDate,
        delivery_time: order.deliveryTime,
        special_instructions: order.specialInstructions,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        is_synced: false,
      },
      synced: false,
      createdAt: now,
    };

    await offlineStorage.addToSyncQueue(syncItem);

    // Try to sync immediately if online
    if (this.isOnline()) {
      this.syncAll();
    }

    return orderId;
  }
}

export const syncService = new SyncService();
