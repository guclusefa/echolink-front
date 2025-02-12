import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Signalement } from '@/types/Signalement';

const url = '/signalements';

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // La distance en kilomètres
};


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
    async fetchSignalements() {
      try {
        const response = await api.get(url);
        const signalements = response.data;

        // Tri des signalements en fonction de la distance
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            signalements.sort((a: Signalement, b: Signalement) => {
              const distanceA = haversineDistance(userLat, userLon, a.latitude, a.longitude);
              const distanceB = haversineDistance(userLat, userLon, b.latitude, b.longitude);
              return distanceA - distanceB;
            });

            this.signalements = signalements;
          });
        }
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
