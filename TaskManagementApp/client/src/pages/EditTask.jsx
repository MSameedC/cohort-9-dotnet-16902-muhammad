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
                // Direct call to fetch the single task using the Guid from the route
                const currentTask = await taskService.getTaskById(id);

                if (currentTask) {
                    setTitle(currentTask.title || '');
                    setDescription(currentTask.description || '');
                    if (currentTask.dueDate) {
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
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-app-bg text-text-muted flex items-center justify-center">
                <span>Loading task details...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-bg text-text-main py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Edit Task
                    </h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-text-muted hover:text-text-main transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="bg-surface border border-border p-6 rounded-xl shadow-lg space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-surface-hover border border-border focus:border-primary outline-none px-4 py-2.5 rounded-lg text-text-main text-sm transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-surface-hover border border-border focus:border-primary outline-none px-4 py-2.5 rounded-lg text-text-main text-sm transition resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Due Date & Time</label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-surface-hover border border-border focus:border-primary outline-none px-4 py-2.5 rounded-lg text-text-main text-sm transition"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg text-sm transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main border border-border px-6 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}