import api from '../api/axios';

export const taskService = {
    // Equivalent to a GET request to retrieve a list of records
    async getTasks() {
        const response = await api.get('/tasks');
        return response.data;
    },

    // Equivalent to a POST request to send new data to the server
    async createTask(taskData) {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // Equivalent to a DELETE request to remove a record by ID
    async deleteTask(id) {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};