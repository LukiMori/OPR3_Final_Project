import { useEffect, useState } from "react";
import { Star, Calendar, Users, Heart, MessageSquare } from "lucide-react";
import { api } from "../services/api.ts";
import { useParams } from "react-router-dom";

import moviePlaceholderImage from "../assets/placeholder-movie.png";
import type { TmdbMovie } from "../types/movie.ts";

const Movie = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [movie, setMovie] = useState<TmdbMovie | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError("Movie ID is required");
        setLoading(false);
        return;
      }

      try {
        const movieData = await api.getMovieDetails(parseInt(movieId));
        console.log(movieData);
        setMovie(movieData);
      } catch (err) {
        setError("Failed to load movie details.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center">
        <div className="text-primary-dark dark:text-dark-text text-xl">
          Loading Movie...
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 text-xl">
          {error || "Movie not found"}
        </div>
      </div>
    );
  }

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : moviePlaceholderImage;

  return (
    <div className="min-h-screen bg-light dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-primary-dark dark:text-dark-text mb-2">
                  {movie.title}
                </h1>
                {movie.releaseDate && (
                  <div className="flex items-center gap-2 text-primary-dark/70 dark:text-dark-text/70">
                    <Calendar size={18} />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="p-3 bg-accent-orange hover:bg-accent-orange/90
                                                 text-light rounded-lg transition-colors"
                  title="Add to favorites"
                >
                  <Heart size={25} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-primary-dark/10 dark:border-dark-text/10">
              <div className="flex items-center gap-2">
                <Star
                  size={24}
                  className="text-accent-orange fill-accent-orange"
                />

                {movie.voteCount === 0 ? (
                  <span className="text-gray-500">No votes yet</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-primary-dark dark:text-dark-text">
                      {movie.rating.toFixed(1)}
                    </span>
                    <span className="text-primary-dark/70 dark:text-dark-text/70">
                      / 10
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-primary-dark/70 dark:text-dark-text/70">
                <Users size={18} />
                <span>{movie.voteCount.toLocaleString()} votes</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-text mb-3">
                Overview
              </h2>
              <p className="text-primary-dark/80 dark:text-dark-text/80 leading-relaxed">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white dark:bg-dark-card rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2">
            <MessageSquare size={24} className="text-accent-orange" />
            Comments
          </h2>

          <div className="mb-6">
            <textarea
              placeholder="Share your thoughts about this movie..."
              className="w-full px-4 py-3 border-2 border-secondary-green rounded-lg
                                     bg-white dark:bg-dark-bg
                                     text-primary-dark dark:text-dark-text
                                     placeholder:text-primary-dark/50 dark:placeholder:text-dark-text/50
                                     focus:border-accent-orange focus:outline-none
                                     resize-none"
              rows={4}
            />
            <button
              className="mt-3 px-6 py-2 bg-accent-orange hover:bg-accent-orange/90
                                     text-light font-semibold rounded-lg transition-colors"
            >
              Post Comment
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-primary-dark/70 dark:text-dark-text/70 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
