import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const completedCount = tasks.filter(t => t.status === 1 || t.status === 'Completed').length;
    const inProgressCount = tasks.filter(t => t.status === 2 || t.status === 'InProgress').length;
    const pendingCount = tasks.filter(t => t.status === 0 || t.status === 'Pending').length;

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-app-bg text-text-muted flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-bg text-text-main py-12 px-4 sm:px-6 lg:px-8">
            

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-text-muted">Manage your tasks</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/tasks/new')}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        New Task
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-text-muted hover:text-red-400 text-sm font-medium transition"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-text-muted hover:text-text-main text-sm font-medium transition"
                    >
                        Profile
                    </button>
                </div>
            </div>

            {/* Dashboard Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-surface border border-border p-4 rounded-xl">
                    <p className="text-sm text-text-muted">Pending Tasks</p>
                    <p className="text-2xl font-semibold text-yellow-400 mt-1">{pendingCount}</p>
                </div>
                <div className="bg-surface border border-border p-4 rounded-xl">
                    <p className="text-sm text-text-muted">In Progress</p>
                    <p className="text-2xl font-semibold text-blue-400 mt-1">{inProgressCount}</p>
                </div>
                <div className="bg-surface border border-border p-4 rounded-xl">
                    <p className="text-sm text-text-muted">Completed</p>
                    <p className="text-2xl font-semibold text-green-400 mt-1">{completedCount}</p>
                </div>
            </div>

            {/* Task List Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider">Your Tasks ({tasks.length})</h2>
                </div>

                {tasks.length === 0 ? (
                    <div className="text-center py-12 bg-surface/30 border border-border rounded-xl">
                        <p className="text-text-muted text-sm mb-3">No tasks found.</p>
                        <button
                            onClick={() => navigate('/tasks/new')}
                            className="bg-surface hover:bg-surface-hover text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-border transition"
                        >
                            Create your first task
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-surface border border-border p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div className="space-y-1">
                                    <h3 className="font-medium text-text-main">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-text-muted text-sm">{task.description}</p>
                                    )}
                                    {task.dueDate && (
                                        <p className="text-xs text-indigo-400 pt-1">
                                            Due: {new Date(task.dueDate).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => navigate(`/tasks/edit/${task.id}`)}
                                        className="text-text-muted hover:text-white bg-surface hover:bg-surface-hover border border-border px-3 py-1 rounded-lg text-xs font-medium transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await taskService.deleteTask(task.id);
                                                fetchTasks();
                                            } catch (error) {
                                                console.error('Failed to delete task:', error);
                                            }
                                        }}
                                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1 rounded-lg text-xs font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}