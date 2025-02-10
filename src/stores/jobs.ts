import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Job } from '@/types/job';

const url = '/jobs';

export const useJobsStore = defineStore({
  id: 'jobs',
  state: () => ({
    jobs: [] as Job[],
    job: {} as Job
  }),
  actions: {
    async fetchJobs() {
      try {
        const response = await api.get(url);
        this.jobs = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchJob(id: string) {
      try {
        const response = await api.get(`${url}/${id}`);
        this.job = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createJob(job: Job) {
      try {
        await api.post(url, job);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateJob(job: Job) {
      const id = job._id;
      const updatedJob = { ...job };
      delete updatedJob._id;

      try {
        await api.put(`${url}/${id}`, updatedJob);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteJob(id: string) {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
});
