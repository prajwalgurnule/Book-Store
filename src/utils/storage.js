// utils/storage.js
export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(`BookStore_${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(`BookStore_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(`BookStore_${key}`);
  } catch (error) {
    console.error(`Error clearing ${key} from localStorage:`, error);
  }
};