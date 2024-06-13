// movie-detail.component.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './movie-detail.component.css'; // Ensure you have a CSS file for styling

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            language: 'en-US',
          },
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MzViZWFjNGU3N2JmNjhlNDJiMTIyZDhlNTU1MDRmMSIsInN1YiI6IjY2NjM4NDQzNjU2ZWQ3NjYwMDMwMjUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VrtNLvUqmEowHSwWw-LZpRz4QOmoPdr9KAROczUKUR4`
          }
        });
  
        const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MzViZWFjNGU3N2JmNjhlNDJiMTIyZDhlNTU1MDRmMSIsInN1YiI6IjY2NjM4NDQzNjU2ZWQ3NjYwMDMwMjUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VrtNLvUqmEowHSwWw-LZpRz4QOmoPdr9KAROczUKUR4`
          }
        });
  
        setMovie({
          ...movieResponse.data,
          credits: creditsResponse.data
        });
  
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
  
    fetchMovieDetails();
  }, [id]);
  

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading movie details.</div>;
  }

  return (
    <div className="container">
      <div className="movie-banner">
        <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt={movie.title} />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <button className="play-button">▶ Play</button>
          <button className="wishlist-button">+ Add to Wish List</button>
        </div>
      </div>
      <div className="movie-details">
        <div className="movie-meta">
          <p>{`Language: ${movie.original_language} | Genre: ${movie.genres.map(genre => genre.name).join(', ')} | ${new Date(movie.release_date).getFullYear()} | ${Math.floor(movie.runtime / 60)}hrs ${movie.runtime % 60}mins`}</p>
        </div>
        <p className="movie-description">
          {movie.overview}
        </p>
        <div className="movie-genre">
          <span>Genre</span>
          {movie.genres.map(genre => (
            <span key={genre.id} className="genre-tag">{genre.name}</span>
          ))}
        </div>
        <div className="movie-rating">
          <span>Rating</span>
          <span className="rating-tag">{movie.adult ? '18+' : 'PG'}</span>
        </div>
      </div>
      <div className="cast-section">
        <h2>Cast</h2>
        <div className="cast-list">
          {movie.credits.cast.slice(0, 8).map((actor, index) => (
            <div key={index} className="cast-member">
              <img src={`https://image.tmdb.org/t/p/w100${actor.profile_path}`} alt={actor.name} />
              <p>{actor.name}</p>
              <p>Actor</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
