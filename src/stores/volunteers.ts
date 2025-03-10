import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api';
import type { User } from '@/types/User';

interface Volunteer extends User {
  distance: number;
  skills: string[];
  availability: boolean;
}

export const useVolunteersStore = defineStore('volunteers', () => {
  const volunteers = ref<Volunteer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Récupérer les volontaires proches d'une position donnée
  const fetchNearbyVolunteers = async (latitude: number, longitude: number, radius: number = 10) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/api/volunteers/nearby', {
        params: { latitude, longitude, radius }
      });
      volunteers.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching nearby volunteers:', err);
    } finally {
      loading.value = false;
    }
  };

  // Filtrer les volontaires par compétence
  const filterBySkill = (skill: string) => {
    return volunteers.value.filter(v => v.skills.includes(skill));
  };

  // Trier les volontaires par distance
  const sortByDistance = () => {
    volunteers.value.sort((a, b) => a.distance - b.distance);
  };

  // Obtenir les volontaires disponibles
  const availableVolunteers = computed(() => {
    return volunteers.value.filter(v => v.availability);
  });

  // Mettre à jour la disponibilité d'un volontaire
  const updateAvailability = async (volunteerId: number, available: boolean) => {
    try {
      await api.patch(`/api/volunteers/${volunteerId}/availability`, {
        availability: available
      });
      
      const volunteer = volunteers.value.find(v => v.id === volunteerId);
      if (volunteer) {
        volunteer.availability = available;
      }
    } catch (err: any) {
      console.error('Error updating volunteer availability:', err);
      throw err;
    }
  };

  return {
    volunteers,
    loading,
    error,
    fetchNearbyVolunteers,
    filterBySkill,
    sortByDistance,
    availableVolunteers,
    updateAvailability
  };
}); 