import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Signalement } from '@/types/Signalement';

const url = '/signalements';

export const useSignalementsStore = defineStore({
  id: 'signalements',
  state: () => ({
    signalements: [] as Signalement[],
    signalement: {} as Signalement
  }),
  actions: {
    async fetchSignalements() {
      try {
        const response = await api.get(url);
        this.signalements = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchSignalement(id: string) {
      try {
        const response = await api.get(`${url}/${id}`);
        this.signalement = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createSignalement(signalement: Signalement) {
      try {
        await api.post(url, signalement);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateSignalement(signalement: Signalement) {
      const id = signalement.id;
      const updatedSignalement = { ...signalement };

      // encore une fois car yanis ne asit pas pas coder sans ça = erreur 500
      delete updatedSignalement.id;

      try {
        await api.put(`${url}/${id}`, updatedSignalement);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteSignalement(id: string) {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async closeSignalement(id: string) {
      try {
        await api.put(`${url}/${id}/close`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    resetSignalement() {
      this.signalement = {} as Signalement;
    }
  }
});
