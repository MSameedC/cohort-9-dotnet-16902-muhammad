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
            // Matches your [HttpPost("login")] route under api/auth
            const response = await api.post('/auth/login', { username, password });

            // Extract the 'token' property sent back from your C# controller
            const jwtToken = response.data.token;

            // Save it to browser storage so the ProtectedRoute can find it
            localStorage.setItem('token', jwtToken);

            // Redirect to the dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            alert('Invalid login credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-96">
                <h2 className="text-2xl font-bold mb-6">Login</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-4 text-white"
                />
                
                <br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-6 text-white"
                />

                <br/>

                <button type="submit" className="w-full bg-indigo-600 p-2 rounded hover:bg-indigo-700 transition">
                    Sign In
                </button>
                
                <br/>
                
                <div className="mt-4 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="text-indigo-400 hover:underline"
                    >
                        Sign up
                    </button>
                </div>
                
            </form>
        </div>
    );
}