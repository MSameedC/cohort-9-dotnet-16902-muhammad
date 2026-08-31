import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // Options: 'All', 'Pending', 'InProgress', 'Completed'
    const navigate = useNavigate();
    
    const pendingCount = tasks.filter(t => t.status === 0 || t.status === 'Pending').length;
    const inProgressCount = tasks.filter(t => t.status === 1 || t.status === 'InProgress').length;
    const completedCount = tasks.filter(t => t.status === 2 || t.status === 'Completed').length;

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'All') return true;
        if (filter === 'Pending') return task.status === 0 || task.status === 'Pending';
        if (filter === 'InProgress') return task.status === 1 || task.status === 'InProgress';
        if (filter === 'Completed') return task.status === 2 || task.status === 'Completed';
        return true;
    });

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

            {/* Filter Bar */}
            <div className="flex gap-2 mb-4">
                {['All', 'Pending', 'InProgress', 'Completed'].map((statusOption) => (
                    <button
                        key={statusOption}
                        onClick={() => setFilter(statusOption)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                            filter === statusOption
                                ? 'bg-primary border-primary text-white'
                                : 'bg-surface border-border text-text-muted hover:text-text-main'
                        }`}
                    >
                        {statusOption}
                    </button>
                ))}
            </div>

            {/* Task List Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider">Your Tasks ({filteredTasks.length})</h2>
                </div>

                {filteredTasks.length === 0 ? (
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
                        {filteredTasks.map((task) => (
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
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
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