import api from '../api/axios';

export const taskService = {
    // GET: api/tasks
    async getTasks() {
        const response = await api.get('/tasks');
        return response.data;
    },

    // GET: api/tasks/{id}
    async getTaskById(id) {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    // POST: api/tasks
    async createTask(taskData) {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // PUT: api/tasks/{id}
    async updateTask(id, taskData) {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    // DELETE: api/tasks/{id}
    async deleteTask(id) {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};