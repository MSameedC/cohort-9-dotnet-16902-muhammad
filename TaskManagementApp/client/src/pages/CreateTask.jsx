import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';

export default function CreateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(1);
    const [dueDate, setDueDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        try {
            await taskService.createTask({
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-app-bg text-text-main py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Create New Task
                    </h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-text-muted hover:text-text-main transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 rounded-2xl shadow-lg space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Task Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Complete backend integration"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-surface-hover border border-border focus:border-primary-hover focus:ring-1 focus:ring-primary-hover outline-none px-4 py-3 rounded-xl text-text-main placeholder-gray-600 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Description</label>
                        <textarea
                            placeholder="Add implementation details or context..."
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-surface-hover border border-border focus:border-primary-hover focus:ring-1 focus:ring-primary-hover outline-none px-4 py-3 rounded-xl text-text-main placeholder-gray-600 transition resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                            className="w-full bg-surface-hover border border-border focus:border-primary-hover outline-none px-4 py-3 rounded-xl text-text-main transition"
                        >
                            <option value={0}>Low</option>
                            <option value={1}>Normal</option>
                            <option value={2}>High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Due Date & Time</label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-surface-hover border border-border focus:border-primary-hover focus:ring-1 focus:ring-primary-hover outline-none px-4 py-3 rounded-xl text-text-main transition"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-xl transition shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {submitting ? 'Creating...' : 'Save Task'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="bg-surface hover:bg-surface-hover text-text-muted px-6 py-3 rounded-xl font-medium transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}