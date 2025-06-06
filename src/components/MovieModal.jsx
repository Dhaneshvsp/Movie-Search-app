import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MovieModal({ imdbID, onClose, theme }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  const noPoster = '/no-poster.jpg';

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        setDetails(response.data);
        setImgSrc(response.data.Poster !== 'N/A' ? response.data.Poster : noPoster);
        console.log('MovieModal - Poster:', response.data.Poster, 'Using fallback:', response.data.Poster === 'N/A');
        console.log('MovieModal - noPoster path:', noPoster);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [imdbID, API_KEY]);

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <p className="loading">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className={`modal-content ${theme}`}>
          <p className="modal-error">{error}</p>
          <button
            onClick={onClose}
            className="modal-button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!details) return null;

  const handleImgError = () => {
    console.log(`MovieModal - Image failed to load for ${details.Title}, using fallback`);
    setImgSrc(noPoster);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        role="button"
        aria-label="Close modal"
      />
      <div className="modal-container fade-in">
        <div className={`modal-content ${theme}`}>
          <div className="modal-header">
            <h3>{details.Title} ({details.Year})</h3>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <img
              src={imgSrc}
              alt={`${details.Title} poster`}
              loading="lazy"
              onError={handleImgError}
            />
            <div className="modal-details">
              <p><strong>Genre:</strong> {details.Genre}</p>
              <p><strong>Director:</strong> {details.Director}</p>
              <p><strong>Actors:</strong> {details.Actors}</p>
              <p><strong>Plot:</strong> {details.Plot}</p>
              <p><strong>IMDB Rating:</strong> {details.imdbRating}</p>
              <p><strong>Runtime:</strong> {details.Runtime}</p>
              <p><strong>Language:</strong> {details.Language}</p>
              <p><strong>Awards:</strong> {details.Awards}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}