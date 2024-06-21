import React from 'react';
import Episode from './Episode';  // Adjust path as needed

const Season = ({ season, onPlay, onPause }) => {
  return (
    <div className="season">
      <h4 className="season-title">Season {season.number}</h4>
      <ul className="episodes-list">
        {season.episodes && season.episodes.length > 0 ? (
          season.episodes.map((episode) => (
            <Episode
              key={episode.id}
              episode={episode}
              onPlay={onPlay}
              onPause={onPause}
            />
          ))
        ) : (
          <li>No episodes available for this season</li>
        )}
      </ul>
    </div>
  );
};

export default Season;
