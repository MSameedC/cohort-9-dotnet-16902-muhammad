import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Assuming you have an endpoint like GET /api/auth/profile or similar, 
        // or decode from token. Adjust endpoint to match your backend route.
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me'); // Replace with your actual user info endpoint if different
                setUser(response.data);
            } catch (error) {
                console.error('Failed to load user profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-app-bg text-text-muted flex items-center justify-center">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-app-bg text-text-main py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">User Profile</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-text-muted hover:text-text-main transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="bg-surface border border-border p-6 rounded-2xl shadow-lg space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted">Username</label>
                        <p className="text-lg text-text-main font-medium mt-1">{user?.username || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted">Email</label>
                        <p className="text-lg text-text-main font-medium mt-1">{user?.email || 'N/A'}</p>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium py-3 rounded-xl transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}