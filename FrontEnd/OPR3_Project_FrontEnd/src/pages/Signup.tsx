import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, UserPlus } from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';

interface SignupForm {
    username: string;
    password: string;
    confirmPassword: string;
}

const Signup = () => {
    const [formData, setFormData] = useState<SignupForm>({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (response.ok) {
                const user = await response.json();

                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/');
                } else {
                    setError('Signup failed. Please try again.');
                }
            } else if (response.status === 409) {
                setError('Username already exists');
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-accent-orange
                    dark:from-dark-bg dark:via-dark-bg dark:to-primary-dark flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <DarkModeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="bg-light dark:bg-dark-card rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Logo and Title */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center">
                            <div className="bg-accent-orange p-3 rounded-full">
                                <Film size={40} className="text-light" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-primary-dark dark:text-dark-text">
                            Movie List App
                        </h1>
                        <p className="text-primary-dark/70 dark:text-dark-text/70">
                            Create your account
                        </p>
                    </div>

                    {/* Form */}
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
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                    <UserPlus size={20} />
                                    <span>Sign Up</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
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