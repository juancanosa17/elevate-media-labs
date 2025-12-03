/**
 * Store - Centralized State Management
 * Simple reactive store with caching
 */

export class Store {
  constructor() {
    this.state = {
      user: null,
      posts: [],
      servicios: [],
      casos: [],
      settings: {},
      media: [],
    };
    
    this.listeners = new Map();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }
  
  /**
   * Get state value
   */
  get(key) {
    return key ? this.state[key] : this.state;
  }
  
  /**
   * Set state value and notify listeners
   */
  set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.notify(key, value, oldValue);
  }
  
  /**
   * Update state partially
   */
  update(key, updater) {
    const oldValue = this.state[key];
    const newValue = typeof updater === 'function' 
      ? updater(oldValue) 
      : { ...oldValue, ...updater };
    this.set(key, newValue);
  }
  
  /**
   * Subscribe to state changes
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }
  
  /**
   * Notify listeners of state change
   */
  notify(key, newValue, oldValue) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(cb => cb(newValue, oldValue));
    }
    
    // Also notify global listeners
    const globalCallbacks = this.listeners.get('*');
    if (globalCallbacks) {
      globalCallbacks.forEach(cb => cb({ key, newValue, oldValue }));
    }
  }
  
  /**
   * Cache management
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * Reset store to initial state
   */
  reset() {
    this.state = {
      user: null,
      posts: [],
      servicios: [],
      casos: [],
      settings: {},
      media: [],
    };
    this.cache.clear();
    this.notify('*', this.state, null);
  }
}

