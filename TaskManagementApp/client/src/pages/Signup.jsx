import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Matches your [HttpPost("register")] route under api/auth
            await api.post('/auth/register', { username, email, password });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-app-bg text-text-main flex items-center justify-center">
            <form onSubmit={handleSignup} className="bg-surface p-8 rounded-lg border border-border w-96">
                <h2 className="text-xl font-semibold mb-6">Create Account</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface-hover border border-border p-2 rounded mb-4 text-text-main"
                    required
                />

                <br/>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-hover border border-border p-2 rounded mb-4 text-text-main"
                    required
                />

                <br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-hover border border-border p-2 rounded mb-6 text-text-main"
                    required
                />
                
                <br/>

                <button type="submit" className="w-full mb-6 bg-primary hover:bg-primary-hover text-text-main p-2.5 rounded-lg text-sm font-medium transition shadow-lg shadow-primary/20">
                    Sign Up
                </button>

                <div className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-primary hover:text-primary-hover"
                    >
                        Log in
                    </button>
                </div>
            </form>
        </div>
    );
}