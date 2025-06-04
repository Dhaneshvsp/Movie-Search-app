import React, { useState } from 'react';

export default function MovieCard({ movie, onClick }) {
  const noPoster = '/no-poster.jpg';
  const [imgSrc, setImgSrc] = useState(movie.Poster !== 'N/A' ? movie.Poster : noPoster);

  const handleImgError = () => {
    console.log(`MovieCard - Image failed to load for ${movie.Title}, using fallback`);
    setImgSrc(noPoster);
  };

  console.log('MovieCard - Poster:', movie.Poster, 'Using fallback:', movie.Poster === 'N/A');
  console.log('MovieCard - noPoster path:', noPoster);

  return (
    <div
      className="movie-card"
      onClick={onClick}
      title={movie.Title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <img
        src={imgSrc}
        alt={`${movie.Title} poster`}
        loading="lazy"
        onError={handleImgError}
      />
      <div className="movie-card-content">
        <h2>{movie.Title}</h2>
        <p>Year: {movie.Year}</p>
        <p>Type: {movie.Type}</p>
      </div>
    </div>
  );
}