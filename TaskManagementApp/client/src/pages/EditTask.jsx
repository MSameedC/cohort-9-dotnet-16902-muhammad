import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskService } from '../services/taskService';

export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const tasks = await taskService.getTasks();
                const currentTask = tasks.find(t => t.id === id);
                if (currentTask) {
                    setTitle(currentTask.title || '');
                    setDescription(currentTask.description || '');
                    if (currentTask.dueDate) {
                        // Format for datetime-local input (YYYY-MM-DDThh:mm)
                        setDueDate(new Date(currentTask.dueDate).toISOString().slice(0, 16));
                    }
                }
            } catch (error) {
                console.error('Failed to load task details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        try {
            await taskService.updateTask(id, {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-gray-400 flex items-center justify-center">
                <span>Loading task details...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Edit Task
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-400 hover:text-white transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none px-4 py-3 rounded-xl text-white transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none px-4 py-3 rounded-xl text-white transition resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Due Date & Time</label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none px-4 py-3 rounded-xl text-white transition"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-xl font-medium transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}