/**
 * Storage Abstraction Utility
 * Provides a safe wrapper around localStorage with error handling and JSON parsing.
 */
export const storage = {
  set: (key: string, value: any): void => {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error);
    }
  },

  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Attempt to parse as JSON; if it fails, return the raw string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clearSubscriptionData: (): void => {
    const keys = [
      "sub_plan_id",
      "sub_plan_name",
      "sub_plan_price",
      "sub_plan_currency",
      "sub_plan_days",
      "sub_phone"
    ];
    keys.forEach(key => localStorage.removeItem(key));
  }
};