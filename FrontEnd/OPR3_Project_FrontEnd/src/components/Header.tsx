import { Film, LogOut, User } from "lucide-react";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import { api } from "../services/api";

import moviePlaceholderImage from "../assets/placeholder-movie.png";
import personPlaceholderImage from "../assets/placeholder-person.png";
import type { MovieSummary } from "../types/movie.ts";
import type { PersonSummary } from "../types/person.ts";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movieResults, setMovieResults] = useState<MovieSummary[]>([]);
  const [personResults, setPersonResults] = useState<PersonSummary[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const searchMovies = async (query: string) => {
    setLoadingMovies(true);
    try {
      const results = await api.searchMovies(query);
      setMovieResults(results.results.slice(0, 4));
    } catch (error) {
      console.error("Failed to search movies:", error);
      setMovieResults([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  const searchPeople = async (query: string) => {
    setLoadingPeople(true);
    try {
      const results = await api.searchPeople(query);
      setPersonResults(results.results.slice(0, 4));
    } catch (error) {
      console.error("Failed to search actors:", error);
      setPersonResults([]);
    } finally {
      setLoadingPeople(false);
    }
  };

  const handleMovieClick = (movie: string) => {
    navigate(`/movie/${movie}`);
  };

  const handlePersonClick = (person: string) => {
    navigate(`/person/${person}`);
  };

  const renderMovieResult = (
    movie: MovieSummary,
    onClick: (id: string) => void,
  ) => {
    return (
      <div
        onClick={() => onClick(movie.id.toString())}
        className="flex gap-3 p-3 hover:bg-light dark:hover:bg-dark-bg transition-colors cursor-pointer"
      >
        <img
          src={
            api.getTmdbImageUrl(movie.posterPath, "w92") ||
            moviePlaceholderImage
          }
          alt={movie.title}
          className="w-12 h-16 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-primary-dark dark:text-dark-text truncate">
            {movie.title}
          </h4>
          <p className="text-sm text-primary-dark/70 dark:text-dark-text/70">
            {movie.releaseYear
              ? new Date(movie.releaseYear).getFullYear()
              : "N/A"}
          </p>
        </div>
      </div>
    );
  };

  const renderPersonResult = (
    person: PersonSummary,
    onClick: (id: string) => void,
  ) => (
    <div
      onClick={() => onClick(person.id.toString())}
      className="flex gap-3 p-3 hover:bg-light dark:hover:bg-dark-bg transition-colors cursor-pointer"
    >
      <img
        src={
          api.getTmdbImageUrl(person.profilePath, "w92") ||
          personPlaceholderImage
        }
        alt={person.name}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-primary-dark dark:text-dark-text truncate">
          {person.name}
        </h4>
      </div>
    </div>
  );

  return (
    <header className="bg-primary-dark dark:bg-dark-card shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          {/* Top row - Logo and Types controls */}
          <div className="flex justify-between  items-center">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
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
                onSearch={searchMovies}
                results={movieResults}
                renderResult={renderMovieResult}
                onResultClick={handleMovieClick}
                loading={loadingMovies}
              />
              <SearchBar
                placeholder="Search actors/directors..."
                onSearch={searchPeople}
                results={personResults}
                renderResult={renderPersonResult}
                onResultClick={handlePersonClick}
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
                <span className="font-medium hidden sm:inline">
                  {user?.username}
                </span>
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
