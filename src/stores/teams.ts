import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Member } from '@/types/member';
import type { Team } from '@/types/team';

const url = '/teams';

export const useTeamsStore = defineStore({
  id: 'teams',
  state: () => ({
    teams: [] as Team[],
    team: {} as Team
  }),
  actions: {
    async fetchTeams() {
      try {
        const response = await api.get(url);
        this.teams = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchTeam(id: string) {
      try {
        const response = await api.get(`${url}/${id}`);
        this.team = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getTeamsMembers(teamId: string) {
      try {
        const response = await api.get(`${url}/${teamId}/members`);
        return response.data as Member[];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createTeam(team: Team) {
      try {
        await api.post(url, team);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateTeam(team: Team) {
      const id = team._id;
      const updatedTeam = { ...team };

      // encore une fois car yanis ne asit pas pas coder sans ça = erreur 500
      delete updatedTeam._id;
      delete updatedTeam.__v;

      try {
        await api.put(`${url}/${id}`, updatedTeam);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteTeam(id: string) {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async addMemberToTeam(teamId: string, memberId: string) {
      try {
        await api.post(`${url}/${teamId}/assign/${memberId}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async removeMemberFromTeam(teamId: string, memberId: string) {
      try {
        await api.delete(`${url}/${teamId}/unassign/${memberId}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    resetTeam() {
      this.team = {} as Team;
    }
  }
});
