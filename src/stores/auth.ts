import api from '@/services/api';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('Initial token:', token);
    console.log('Initial user:', user);
    
    return {
      user: user ? JSON.parse(user) : null,
      token: token || ''
    }
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        console.log('Attempting login with:', credentials);
        // Request
        const response = await api.post('/api/auth/login', {
          email: credentials.email,
          password: credentials.password
        });
        console.log('Login response:', response.data);
        
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }
        
        // Response
        const { token } = response.data;
        this.token = token;
        localStorage.setItem('token', token);
        console.log('Token stored:', token);

        // Get user
        await this.getUser();
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    async getUser() {
      try {
        const response = await api.get('/api/auth/me');
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log('User stored:', this.user);
      } catch (error) {
        console.error('Get user error:', error);
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
        const body = {
          email: credentials.email,
          name: credentials.name,
          lastName: credentials.lastName,
          password: credentials.password,
          longitude: credentials.longitude,
          latitude: credentials.latitude
        };

        const response = await api.post('/api/auth/register', body);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }
      } catch (error) {
        console.error('Register error:', error);
        throw error;
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Logged out, token and user removed');
    }
  }
});
