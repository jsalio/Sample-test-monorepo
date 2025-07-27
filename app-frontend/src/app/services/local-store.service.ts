import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  constructor() { }

  setItem<T>(key: string, value: T): void {
    if (typeof value === 'undefined' || value === null) {
      throw new Error('Cannot store undefined or null values');
    }
    if (key === '') {
      throw new Error('Key cannot be an empty string');
    }
    if (key.length > 100) {
      throw new Error('Key length exceeds 100 characters');
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item === null) {
      throw new Error(`No item found for key: ${key}`);
    }
    if (item === 'undefined') {
      throw new Error('Stored value is undefined');
    }
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
