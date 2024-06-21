import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchShow } from '../services/PodcastService.js';
import AudioPlayer from './AudioPlayer';
import './Show.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const Show = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [favorites, setFavorites] = useState({}); // State to manage favorite episodes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShow(showId);
        setShow(data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching show with ID ${showId}:`, error);
        setLoading(false);
        // Handle error state
      }
    };

    fetchData();
  }, [showId]);

  const handleSeasonSelect = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setOpenDropdown(openDropdown === seasonNumber ? null : seasonNumber);
    setPlayingEpisode(null); // Reset playing episode when selecting a new season
  };

  const playEpisode = (episodeId) => {
    setPlayingEpisode(episodeId);
  };

  const pauseEpisode = () => {
    setPlayingEpisode(null);
  };

  const toggleFavorite = (episodeId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [episodeId]: !prevFavorites[episodeId],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="show-container">
      <Link to="/" className="back-button">
        Back to Home
      </Link>
      <div className="show-header">
        <h1 className="show-title">{show.title}</h1>
        <img src={show.image} alt={show.title} className="show-image" />
        <p className="show-description">{show.description}</p>
      </div>

      <div className="season-selector">
        <h2 className="seasons-title">Select a Season</h2>
        <ul className="seasons-list">
          {show.seasons.map((season) => (
            <li key={season.number} className="season-item">
              <button onClick={() => handleSeasonSelect(season.number)} className="season-button">
                Season {season.number}
              </button>
              {openDropdown === season.number && (
                <div className="dropdown-content">
                  <ul className="episodes-list">
                    {season.episodes.map((episode) => (
                      <li key={episode.id} className="episode-item">
                        <div className="episode-details">
                          <h3 className="episode-title">{episode.title}</h3>
                          <p className="episode-duration">Duration: {episode.duration}</p>
                          <div className="favorite-icon" onClick={() => toggleFavorite(episode.id)}>
                            <FontAwesomeIcon
                              icon={favorites[episode.id] ? solidHeart : regularHeart}
                              className={favorites[episode.id] ? 'heart-solid' : 'heart-regular'}
                            />
                          </div>
                          <AudioPlayer
                            key={episode.id} // Unique key for AudioPlayer
                            src={episode.audioSrc}
                            isPlaying={playingEpisode === episode.id}
                            onPlay={() => playEpisode(episode.id)}
                            onPause={pauseEpisode}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {selectedSeason && (
        <div className="episodes-container">
          <h2 className="episodes-title">Episodes of Season {selectedSeason}</h2>
          <ul className="episodes-list">
            {show.seasons
              .find((season) => season.number === selectedSeason)
              .episodes.map((episode) => (
                <li key={episode.id} className="episode-item">
                  <div className="episode-details">
                    <h3 className="episode-title">{episode.title}</h3>
                    <p className="episode-duration">Duration: {episode.duration}</p>
                    <div className="favorite-icon" onClick={() => toggleFavorite(episode.id)}>
                      <FontAwesomeIcon
                        icon={favorites[episode.id] ? solidHeart : regularHeart}
                        className={favorites[episode.id] ? 'heart-solid' : 'heart-regular'}
                      />
                    </div>
                    <AudioPlayer
                      key={episode.id} // Unique key for AudioPlayer
                      src={episode.audioSrc}
                      isPlaying={playingEpisode === episode.id}
                      onPlay={() => playEpisode(episode.id)}
                      onPause={pauseEpisode}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Show;
