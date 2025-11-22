import { useState } from 'react';
import { Star, Calendar, Users, Heart, MessageSquare, Share2 } from 'lucide-react';
import type { TmdbMovie } from "../types/tmdb.ts";

const Movie = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [movie, setMovie] = useState<TmdbMovie | null>(null);

    if (loading) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center">
                <div className="text-primary-dark dark:text-dark-text text-xl">Loading Movie...</div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center">
                <div className="text-red-600 dark:text-red-400 text-xl">{error || 'Movie not found'}</div>
            </div>
        );
    }

    const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : '/placeholder-movie.png';

    const backdropUrl = movie.backdropPath
        ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
        : null;

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg">
            {/* Backdrop Header */}
            {backdropUrl && (
                <div className="relative h-96 w-full">
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-light dark:from-dark-bg via-light/60 dark:via-dark-bg/60 to-transparent" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Movie Card */}
                <div className={`bg-white dark:bg-dark-card rounded-xl shadow-md p-8 ${backdropUrl ? '-mt-32 relative z-10' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={posterUrl}
                                alt={movie.title}
                                className="w-64 h-96 object-cover rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1">
                            {/* Title and Actions */}
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
                                        <Heart size={20} />
                                    </button>
                                    <button
                                        className="p-3 bg-secondary-green hover:bg-secondary-green/80
                                                 text-primary-dark rounded-lg transition-colors"
                                        title="Share"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Rating and Stats */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-primary-dark/10 dark:border-dark-text/10">
                                <div className="flex items-center gap-2">
                                    <Star size={24} className="text-accent-orange fill-accent-orange" />
                                    <span className="text-2xl font-bold text-primary-dark dark:text-dark-text">
                                        {movie.voteAverage.toFixed(1)}
                                    </span>
                                    <span className="text-primary-dark/70 dark:text-dark-text/70">/ 10</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary-dark/70 dark:text-dark-text/70">
                                    <Users size={18} />
                                    <span>{movie.voteCount.toLocaleString()} votes</span>
                                </div>
                            </div>

                            {/* Overview */}
                            <div>
                                <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-text mb-3">
                                    Overview
                                </h2>
                                <p className="text-primary-dark/80 dark:text-dark-text/80 leading-relaxed">
                                    {movie.overview}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-6 bg-white dark:bg-dark-card rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2">
                        <MessageSquare size={24} className="text-accent-orange" />
                        Comments
                    </h2>

                    {/* Add Comment Form */}
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

                    {/* Comments List */}
                    <div className="space-y-4">
                        {/* Example comment structure - you'll populate this with actual data */}
                        <div className="p-4 rounded-lg bg-light dark:bg-dark-bg">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-accent-orange rounded-full flex items-center justify-center">
                                        <span className="text-light font-semibold text-sm">U</span>
                                    </div>
                                    <span className="font-semibold text-primary-dark dark:text-dark-text">
                                        Username
                                    </span>
                                </div>
                                <span className="text-xs text-primary-dark/70 dark:text-dark-text/70">
                                    2 days ago
                                </span>
                            </div>
                            <p className="text-primary-dark/80 dark:text-dark-text/80 ml-10">
                                This is an example comment. Your actual comments will appear here.
                            </p>
                        </div>

                        {/* Empty state */}
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