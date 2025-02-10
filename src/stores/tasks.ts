import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Task } from '@/types/task';

const url = '/tasks';

export const useTasksStore = defineStore({
  id: 'tasks',
  state: () => ({
    tasks: [] as Task[],
    task: {} as Task,
    createdTask: {} as Task
  }),
  actions: {
    async fetchWorkerTasks(workerId: string) {
      try {
        const response = await api.get(`/workers/${workerId}/tasks`);
        this.tasks = response.data;
        this.cleanTasks();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchTeamTasks(teamId: string) {
      try {
        const response = await api.get(`/teams/${teamId}/tasks`);
        this.tasks = response.data;
        this.cleanTasks();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchTasks() {
      try {
        const response = await api.get(url);
        this.tasks = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchTask(id: string) {
      try {
        const response = await api.get(`${url}/${id}`);
        this.task = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createTask(task: Task) {
      try {
        const reponse = await api.post(url, task);
        this.createdTask = reponse.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateTask(task: Task) {
      const id = task._id;
      const updatedTask = { ...task };

      // car yanis ne sait pas coder : sinon erreur
      delete updatedTask._id;
      delete updatedTask.__v;

      try {
        await api.put(`${url}/${id}`, updatedTask);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteTask(id: string) {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async assignTaskToWorker(workerId: string, taskId: string) {
      try {
        await api.post(`/tasks/${taskId}/assign/${workerId}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    cleanTasks() {
      // remove every null from the array
      this.tasks = this.tasks.filter((task) => task !== null);
    }
  }
});
