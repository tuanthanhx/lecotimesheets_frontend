// Utilities
import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userData: JSON.parse(localStorage.getItem('userData')) || null,
  }),
  actions: {
    setUser(data) {
      this.userData = data;
      localStorage.setItem('userData', JSON.stringify(data));
    },
    clearUser() {
      this.userData = null;
      localStorage.removeItem('userData');
    },
  },
});
