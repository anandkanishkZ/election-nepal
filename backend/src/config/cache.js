/**
 * Simple in-memory cache for analytics data
 * Caches expensive queries for 5 minutes
 */

class Cache {
  constructor() {
    this.store = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now > item.expiry) {
      this.store.delete(key);
      return null;
    }

    console.log(`✓ Cache HIT: ${key}`);
    return item.data;
  }

  set(key, data, customTTL = null) {
    const expiry = Date.now() + (customTTL || this.ttl);
    this.store.set(key, { data, expiry });
    console.log(`✓ Cache SET: ${key} (expires in ${((customTTL || this.ttl) / 1000)}s)`);
  }

  delete(key) {
    this.store.delete(key);
    console.log(`✓ Cache DELETE: ${key}`);
  }

  clear() {
    this.store.clear();
    console.log('✓ Cache CLEARED');
  }

  getStats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    };
  }
}

// Singleton instance
const cache = new Cache();

module.exports = cache;
