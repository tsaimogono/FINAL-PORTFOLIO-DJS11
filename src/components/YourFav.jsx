// src/components/Yourfav.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavouriteContext';
import './Header.css';

const Yourfav = () => {
  const { favorites, removeFavorite } = useFavorites();

  // Convert favorites object to an array of values
  const favoriteEpisodes = Object.values(favorites);

  // Check if there are no favorite episodes
  if (favoriteEpisodes.length === 0) {
    return <div>Not Yet Listed!</div>;
  }

  return (
    <div className="favorites-container">
      <h1>Favorite Episodes</h1>
      <ul className="favorites-list">
        {favoriteEpisodes.map((episode) => (
          <li key={episode.id} className="favorite-item">
            <h3>{episode.title}</h3>
            <p>Show: <Link to={`/show/${episode.showId}`}>{episode.showTitle}</Link></p>
            <p>Season: {episode.seasonNumber}</p>
            <button onClick={() => removeFavorite(episode.id)}>Remove from Favorites</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Yourfav;
