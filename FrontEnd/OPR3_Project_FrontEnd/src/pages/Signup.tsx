import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Film, UserPlus} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';
import {useAuth} from '../context/AuthContext';
import {api} from '../services/api';
import type {SignupRequest} from "../types/user.ts";

const Signup = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            setLoading(false);
            return;
        }

        try {
            const signupRequest: SignupRequest = {username: username, password: password};
            const authResponse = await api.signup(signupRequest);
            login(authResponse);
            navigate('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-accent-orange
                    dark:from-dark-bg dark:via-dark-bg dark:to-primary-dark flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <DarkModeToggle/>
            </div>

            <div className="w-full max-w-md">
                <div className="bg-light dark:bg-dark-card rounded-2xl shadow-2xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center">
                            <div className="bg-accent-orange p-3 rounded-full">
                                <Film size={40} className="text-light"/>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-primary-dark dark:text-dark-text">
                            Movie List App
                        </h1>
                        <p className="text-primary-dark/70 dark:text-dark-text/70">
                            Create your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                minLength={3}
                                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-green
                         bg-white dark:bg-dark-bg dark:border-primary-dark
                         text-primary-dark dark:text-dark-text
                         focus:border-accent-orange dark:focus:border-accent-orange
                         focus:outline-none transition-colors"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-green
                         bg-white dark:bg-dark-bg dark:border-primary-dark
                         text-primary-dark dark:text-dark-text
                         focus:border-accent-orange dark:focus:border-accent-orange
                         focus:outline-none transition-colors"
                                placeholder="Create a password (min. 6 characters)"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-green
                         bg-white dark:bg-dark-bg dark:border-primary-dark
                         text-primary-dark dark:text-dark-text
                         focus:border-accent-orange dark:focus:border-accent-orange
                         focus:outline-none transition-colors"
                                placeholder="Confirm your password"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                            text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent-orange hover:bg-accent-orange/90
                       disabled:bg-accent-orange/50 disabled:cursor-not-allowed
                       text-light font-semibold py-3 rounded-lg
                       transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span>Creating account...</span>
                            ) : (
                                <>
                                    <UserPlus size={20}/>
                                    <span>Sign Up</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-primary-dark/70 dark:text-dark-text/70">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-accent-orange hover:text-accent-orange/80 font-semibold transition-colors"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;