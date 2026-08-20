import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            const jwtToken = response.data.token;
            localStorage.setItem('token', jwtToken);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            alert('Invalid login credentials');
        }
    };

    return (
        <div className="min-h-screen bg-app-bg text-text-main flex items-center justify-center p-4">
            <form onSubmit={handleLogin} className="bg-surface p-8 rounded-xl border border-border w-full max-w-sm shadow-xl">
                <h2 className="text-xl font-semibold mb-6">Login</h2>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-surface-hover border border-border p-2.5 rounded-lg text-text-main text-sm focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-hover border border-border p-2.5 rounded-lg text-text-main text-sm focus:outline-none focus:border-primary transition"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg text-sm font-medium transition shadow-lg shadow-primary/20"
                >
                    Sign In
                </button>

                <div className="mt-6 text-center text-sm text-text-muted">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="text-primary hover:text-primary-hover font-medium transition"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}