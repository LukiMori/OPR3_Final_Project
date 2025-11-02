import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-light dark:bg-dark-card text-primary-dark dark:text-dark-text
                 hover:bg-secondary-green dark:hover:bg-dark-bg transition-colors duration-200"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default DarkModeToggle;