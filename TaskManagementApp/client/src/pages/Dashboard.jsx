import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            <div className="min-h-screen bg-gray-950 text-gray-400 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading workspace...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Task Dashboard
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Manage your schedule and deadlines</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/tasks/new')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition duration-200 shadow-lg shadow-indigo-600/20"
                        >
                            + New Task
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-800 hover:bg-red-600/20 text-gray-300 hover:text-red-400 border border-gray-700 hover:border-red-500/50 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Task List Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-lg font-semibold text-gray-200">Your Tasks</h2>
                        <span className="text-xs font-medium bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full border border-gray-700">
                            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                        </span>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="text-center py-16 bg-gray-900/50 border border-gray-800/80 rounded-2xl">
                            <p className="text-gray-400 font-medium">No tasks found</p>
                            <p className="text-sm text-gray-600 mt-1 mb-4">Get started by creating your first task.</p>
                            <button
                                onClick={() => navigate('/tasks/new')}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            >
                                Create Task
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-700 transition duration-200"
                                >
                                    <div className="space-y-2 flex-1">
                                        <h3 className="font-semibold text-base text-gray-100">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
                                        )}
                                        {task.dueDate && (
                                            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium pt-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Due: {new Date(task.dueDate).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <button
                                            onClick={() => navigate(`/tasks/edit/${task.id}`)}
                                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3.5 py-1.5 rounded-xl text-sm font-medium transition"
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
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-xl text-sm font-medium transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}