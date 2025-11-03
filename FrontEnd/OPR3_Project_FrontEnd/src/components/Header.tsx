import {Film, LogOut} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <header className="bg-primary-dark dark:bg-dark-card shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link   to="/Home">
                        <div className="bg-accent-orange p-2 rounded-lg">
                            <Film size={28} className="text-light" />
                        </div>
                        </Link>
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
    );
};

export default Header;




