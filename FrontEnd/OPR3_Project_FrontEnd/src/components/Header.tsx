import { Film, LogOut, User } from "lucide-react";
import { useState, useCallback } from "react";
import DarkModeToggle from "./DarkModeToggle.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import { api } from "../services/api";
import type { TmdbMovie, TmdbPerson } from "../types/tmdb";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [movieResults, setMovieResults] = useState<TmdbMovie[]>([]);
    const [personResults, setPersonResults] = useState<TmdbPerson[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [loadingPeople, setLoadingPeople] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMovieSearch = useCallback(async (query: string) => {
        setLoadingMovies(true);
        try {
            const results = await api.searchMovies(query);
            setMovieResults(results.results.slice(0, 5));
        } catch (error) {
            console.error('Movie search error:', error);
            setMovieResults([]);
        } finally {
            setLoadingMovies(false);
        }
    }, []);

    const handlePersonSearch = useCallback(async (query: string) => {
        setLoadingPeople(true);
        try {
            const results = await api.searchPeople(query);
            setPersonResults(results.results.slice(0, 5));
        } catch (error) {
            console.error('Person search error:', error);
            setPersonResults([]);
        } finally {
            setLoadingPeople(false);
        }
    }, []);

    const renderMovieResult = (movie: TmdbMovie) => (
        <Link
            to={`/movie/${movie.id}`}
            className="flex gap-3 p-3 hover:bg-light dark:hover:bg-dark-bg transition-colors cursor-pointer"
        >
            <img
                src={api.getTmdbImageUrl(movie.posterPath, 'w92') || '/placeholder-movie.png'}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-primary-dark dark:text-dark-text truncate">
                    {movie.title}
                </h4>
                <p className="text-sm text-primary-dark/70 dark:text-dark-text/70">
                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                </p>
                {movie.voteAverage > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-accent-orange text-sm">★</span>
                        <span className="text-sm text-primary-dark dark:text-dark-text">
              {movie.voteAverage.toFixed(1)}
            </span>
                    </div>
                )}
            </div>
        </Link>
    );

    const renderPersonResult = (person: TmdbPerson) => (
        <Link
            to={`/person/${person.id}`}
            className="flex gap-3 p-3 hover:bg-light dark:hover:bg-dark-bg transition-colors cursor-pointer"
        >
            <img
                src={api.getTmdbImageUrl(person.profilePath, 'w92') || '/placeholder-person.png'}
                alt={person.name}
                className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-primary-dark dark:text-dark-text truncate">
                    {person.name}
                </h4>
                <p className="text-sm text-primary-dark/70 dark:text-dark-text/70">
                    {person.knownForDepartment}
                </p>
            </div>
        </Link>
    );

    return (
        <header className="bg-primary-dark dark:bg-dark-card shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col gap-4">
                    {/* Top row - Logo and User controls */}
                    <div className="flex justify-between  items-center">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="bg-accent-orange p-2 rounded-lg">
                                <Film size={28} className="text-light" />
                            </div>
                            <h1 className="text-2xl font-bold text-light dark:text-dark-text">
                                Movie List App
                            </h1>
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SearchBar
                                placeholder="Search movies..."
                                onSearch={handleMovieSearch}
                                results={movieResults}
                                renderResult={renderMovieResult}
                                loading={loadingMovies}
                            />
                            <SearchBar
                                placeholder="Search actors/directors..."
                                onSearch={handlePersonSearch}
                                results={personResults}
                                renderResult={renderPersonResult}
                                loading={loadingPeople}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 text-light dark:text-dark-text
                         hover:text-accent-orange transition-colors"
                            >
                                <User size={20} />
                                <span className="font-medium hidden sm:inline">{user?.username}</span>
                            </Link>
                            <DarkModeToggle />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90
                         text-light font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom row - Search bars */}

                </div>
            </div>
        </header>
    );
};

export default Header;