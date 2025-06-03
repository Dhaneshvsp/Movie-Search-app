import React from 'react';
import noPoster from '../assets/no-poster.jpg'; // Import the fallback image

export default function MovieCard({ movie, onClick }) {
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
        src={movie.Poster !== 'N/A' ? movie.Poster : noPoster}
        alt={`${movie.Title} poster`}
        loading="lazy"
      />
      <div className="movie-card-content">
        <h2>{movie.Title}</h2>
        <p>Year: {movie.Year}</p>
        <p>Type: {movie.Type}</p>
      </div>
    </div>
  );
}