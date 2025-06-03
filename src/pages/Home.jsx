import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import '../styles.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  const fetchMovies = async (searchQuery = query) => {
    const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
    if (!searchQuery) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`);
      setMovies(response.data.Search || []);
      if (response.data.Search) {
        const newHistory = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      setError('Failed to fetch movies. Please try again.');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="content">
        <header className="header">
          <h1>🎬 Movie Search App</h1>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="search-section">
          <div className="search-form">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMovies()}
              className="search-input"
              aria-label="Movie search input"
            />
            <button
              onClick={() => fetchMovies()}
              disabled={isLoading}
              className="search-button"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchHistory.length > 0 && (
            <div className="search-history">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(item);
                    fetchMovies(item);
                  }}
                  className="history-item"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="error-message" role="alert">{error}</p>
        )}

        {movies.length === 0 && !isLoading && !error && (
          <p className="no-results">No movies found. Try searching for something else.</p>
        )}

        {isLoading && (
          <p className="loading">Loading movies...</p>
        )}

        <div className="movie-grid">
          {movies.map((movie, index) => (
            <div
              key={movie.imdbID}
              className="fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MovieCard
                movie={movie}
                onClick={() => setSelectedMovieId(movie.imdbID)}
              />
            </div>
          ))}
        </div>

        {selectedMovieId && (
          <MovieModal
            imdbID={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}