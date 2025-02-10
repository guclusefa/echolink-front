import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Member } from '@/types/member';
import type { Team } from '@/types/team';

const url = '/workers';

export const useMembersStore = defineStore({
  id: 'members',
  state: () => ({
    members: [] as Member[],
    member: {} as Member
  }),
  actions: {
    async fetchMembers() {
      try {
        const response = await api.get(url);
        this.members = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchMember(id: string) {
      try {
        const response = await api.get(`${url}/${id}`);
        this.member = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createMember(member: Member) {
      try {

        // car yanis ne asit pas coder sans ça = erreur 500
        member.email = "email@gmail.com";
        member.passwordHash = "lepassword";

        await api.post(url, member);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateMember(member: Member) {
      const id = member._id;
      const updatedMember = { ...member };

      // encore une fois car yanis ne asit pas pas coder sans ça = erreur 500
      delete updatedMember._id;
      delete updatedMember.__v;
      delete updatedMember.poste;

      try {
        await api.put(`${url}/${id}`, updatedMember);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteMember(id: string) {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getMembersTeams(memberId: string) {
      try {
        const response = await api.get(`${url}/${memberId}/team`);
        return response.data as Team[];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    resetMember() {
      this.member = {} as Member;
    }
  }
});
