// IndexedDB wrapper for offline-first storage

const DB_NAME = 'udc_offline';
const DB_VERSION = 1;

export interface OfflineOrder {
  id: string;
  userId: string;
  orderNumber?: string;
  serviceType: string;
  status: string;
  weightLbs?: number;
  itemCount?: number;
  pickupDate?: string;
  pickupTime?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  subtotal: number;
  tax: number;
  total: number;
  isSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfflineProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface SyncQueueItem {
  id: string;
  userId: string;
  actionType: 'create' | 'update' | 'delete';
  tableName: string;
  recordId: string;
  data: any;
  synced: boolean;
  error?: string;
  createdAt: string;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('orders')) {
          const ordersStore = db.createObjectStore('orders', { keyPath: 'id' });
          ordersStore.createIndex('userId', 'userId', { unique: false });
          ordersStore.createIndex('isSynced', 'isSynced', { unique: false });
        }

        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('synced', 'synced', { unique: false });
          syncStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('auth')) {
          db.createObjectStore('auth', { keyPath: 'key' });
        }
      };
    });
  }

  // Orders CRUD
  async saveOrder(order: OfflineOrder): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.put(order);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getOrders(userId: string): Promise<OfflineOrder[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getOrder(id: string): Promise<OfflineOrder | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Profile CRUD
  async saveProfile(profile: OfflineProfile): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['profiles'], 'readwrite');
      const store = transaction.objectStore('profiles');
      const request = store.put(profile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProfile(id: string): Promise<OfflineProfile | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['profiles'], 'readonly');
      const store = transaction.objectStore('profiles');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync Queue CRUD
  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingSyncItems(userId: string): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const items = request.result.filter((item: SyncQueueItem) => !item.synced);
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markSynced(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.synced = true;
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Auth storage (for offline session)
  async saveAuth(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['auth'], 'readwrite');
      const store = transaction.objectStore('auth');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAuth(key: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['auth'], 'readonly');
      const store = transaction.objectStore('auth');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAuth(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['auth'], 'readwrite');
      const store = transaction.objectStore('auth');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
