import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-5 h-5">
                {/* Sun icon for light mode */}
                <Sun
                    className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                        }`}
                />
                {/* Moon icon for dark mode */}
                <Moon
                    className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
