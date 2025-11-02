import { Film, LogOut } from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg">
            <header className="bg-primary-dark dark:bg-dark-card shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent-orange p-2 rounded-lg">
                                <Film size={28} className="text-light" />
                            </div>
                            <h1 className="text-2xl font-bold text-light dark:text-dark-text">
                                Movie List App
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
              <span className="text-light dark:text-dark-text font-medium">
                Welcome, {user?.username}!
              </span>
                            <DarkModeToggle />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90
                         text-light font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-8">
                    <h2 className="text-3xl font-bold text-primary-dark dark:text-dark-text mb-4">
                        Your Movies
                    </h2>
                    <p className="text-primary-dark/70 dark:text-dark-text/70 text-lg">
                        Movie list functionality coming soon...
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Home;