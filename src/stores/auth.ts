import api from '@/services/api';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        // Request
        const response = await api.post('/auth/login', credentials);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }
        // Response
        const { token } = response.data;
        this.token = token;
        localStorage.setItem('token', token); // Save token to local storage

        // Get user
        await this.getUser();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getUser() {
      try {
        const response = await api.get('/auth/me');
        this.user = response.data;

        console.log(JSON.stringify(this.user));
        localStorage.setItem('user', JSON.stringify(this.user)); // Save user to local storage
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async register(credentials: {
      email: string;
      name: string;
      lastName: string;
      password: string;
      longitude: string;
      latitude: string;
    }) {
      try {
        // formattage car yanis sait pas coder
        const body = {
          email: credentials.email,
          name: credentials.name,
          lastName: credentials.lastName,
          password: credentials.password,
          longitude: credentials.longitude,
          latitude: credentials.latitude
        };

        // Request
        const response = await api.post('/auth/register', body);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    logout() {
      this.token = '';
      this.user = '';
      localStorage.removeItem('token'); // Remove token from local storage
      localStorage.removeItem('user'); // Remove user from local storage
    }
  }
});
