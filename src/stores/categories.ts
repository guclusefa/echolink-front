import api from '@/services/api';
import { defineStore } from 'pinia';

import type { Category } from '@/types/Category';

const url = '/api/categories';

export const useCategoriesStore = defineStore({
  id: 'categories',
  state: () => ({
    categories: [] as Category[],
    category: {} as Category
  }),
  actions: {
    async fetchCategories() {
      try {
        console.log('Fetching categories from:', url);
        const response = await api.get(url);
        console.log('Categories response:', response.data);
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    async fetchCategory(id: string) {
      try {
        const response = await api.get(`${url}/${id}`);
        this.category = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async createCategory(category: Category) {
      try {
        await api.post(url, category);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateCategory(category: Category) {
      const id = category.id;
      const updatedCategory = { ...category };

      // encore une fois car yanis ne asit pas pas coder sans ça = erreur 500
      delete updatedCategory.id;

      try {
        await api.put(`${url}/${id}`, updatedCategory);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteCategory(id: string) {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    resetCategory() {
      this.category = {} as Category;
    }
  }
});
