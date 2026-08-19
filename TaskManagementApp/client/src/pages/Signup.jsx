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
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-96">
                <h2 className="text-2xl font-bold mb-6">Create Account</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-4 text-white"
                    required
                />

                <br/>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-4 text-white"
                    required
                />

                <br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-6 text-white"
                    required
                />
                
                <br/>

                <button type="submit" className="w-full bg-indigo-600 p-2 rounded hover:bg-indigo-700 transition mb-4">
                    Sign Up
                </button>

                <div className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-indigo-400 hover:underline"
                    >
                        Log in
                    </button>
                </div>
            </form>
        </div>
    );
}