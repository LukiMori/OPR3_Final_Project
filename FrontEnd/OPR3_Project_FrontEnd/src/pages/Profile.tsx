import { useState, useEffect } from "react";
import {
  User,
  Film,
  MessageSquare,
  Edit2,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../types/types.ts";

import moviePlaceholderImage from "../assets/placeholder-movie.png";

const Profile = () => {
  const { login } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [updatingUsername, setUpdatingUsername] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile();
      setProfile(data);
      setNewUsername(data.username);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (newUsername.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    if (newUsername === profile?.username) {
      setIsEditingUsername(false);
      return;
    }

    setUpdatingUsername(true);
    setUsernameError("");

    try {
      const authResponse = await api.updateUsername(newUsername);
      login(authResponse);
      setProfile((prev) => (prev ? { ...prev, username: newUsername } : null));
      setIsEditingUsername(false);
    } catch (err) {
      if (err instanceof Error) {
        setUsernameError(err.message);
      } else {
        setUsernameError("Failed to update username");
      }
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setNewUsername(profile?.username || "");
    setIsEditingUsername(false);
    setUsernameError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center">
        <div className="text-primary-dark dark:text-dark-text text-xl">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 text-xl">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light dark:bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-accent-orange p-4 rounded-full">
                <User size={48} className="text-light" />
              </div>

              <div>
                {/* Username Section */}
                <div className="flex items-center gap-3 mb-2">
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="px-3 py-2 border-2 border-secondary-green rounded-lg
                                 bg-white dark:bg-dark-bg
                                 text-primary-dark dark:text-dark-text
                                 focus:border-accent-orange focus:outline-none"
                        minLength={3}
                        disabled={updatingUsername}
                      />
                      <button
                        onClick={handleUpdateUsername}
                        disabled={updatingUsername}
                        className="p-2 bg-secondary-green hover:bg-secondary-green/80
                                 rounded-lg transition-colors disabled:opacity-50"
                        title="Save"
                      >
                        <Check size={20} className="text-primary-dark" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updatingUsername}
                        className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20
                                 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X
                          size={20}
                          className="text-red-600 dark:text-red-400"
                        />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-4xl font-bold text-primary-dark dark:text-dark-text">
                        {profile.username}
                      </h1>
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="p-2 hover:bg-light dark:hover:bg-dark-bg rounded-lg transition-colors"
                        title="Edit username"
                      >
                        <Edit2 size={20} className="text-accent-orange" />
                      </button>
                    </>
                  )}
                </div>

                {usernameError && (
                  <p className="text-red-600 dark:text-red-400 text-sm mb-2">
                    {usernameError}
                  </p>
                )}

                {/* Stats */}
                <div className="flex gap-6 text-primary-dark/70 dark:text-dark-text/70">
                  <div className="flex items-center gap-2">
                    <Film size={18} />
                    <span>{profile.totalFavorites} Favorites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <span>{profile.totalComments} Comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Favorite Movies */}
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2">
              <Film size={24} className="text-accent-orange" />
              Favorite Movies
            </h2>

            {profile.favoriteMovies.length === 0 ? (
              <p className="text-primary-dark/70 dark:text-dark-text/70 text-center py-8">
                No favorite movies yet. Start adding some!
              </p>
            ) : (
              <div className="space-y-4">
                {profile.favoriteMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex gap-4 p-4 rounded-lg bg-light dark:bg-dark-bg
                             hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={movie.posterPath || moviePlaceholderImage}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-dark dark:text-dark-text">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-primary-dark/70 dark:text-dark-text/70">
                        {movie.releaseYear}
                      </p>
                    </div>
                    <button
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2
                        size={18}
                        className="text-red-600 dark:text-red-400"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Comments */}
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2">
              <MessageSquare size={24} className="text-accent-orange" />
              Recent Comments
            </h2>

            {profile.recentComments.length === 0 ? (
              <p className="text-primary-dark/70 dark:text-dark-text/70 text-center py-8">
                No comments yet. Share your thoughts on movies!
              </p>
            ) : (
              <div className="space-y-4">
                {profile.recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-lg bg-light dark:bg-dark-bg
                             hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-primary-dark dark:text-dark-text">
                        {comment.movieTitle}
                      </h3>
                      <span className="text-xs text-primary-dark/70 dark:text-dark-text/70">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-primary-dark/80 dark:text-dark-text/80">
                      {comment.content}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-sm text-accent-orange hover:text-accent-orange/80 transition-colors">
                        Edit
                      </button>
                      <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
