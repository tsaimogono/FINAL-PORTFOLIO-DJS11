import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPreviews } from '../services/PodcastService.js';
import { useFavorites } from '../contexts/FavouriteContext.jsx';
import AudioPlayer from './AudioPlayer'; // Import the AudioPlayer component
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure this import is present

const Home = () => {
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('All');
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPreviews();
        setPreviews(data);
        setFilteredPreviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching previews:', error);
        setError('Failed to fetch podcast previews.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sortData = (criteria, data) => {
      let sortedData = [...data];
      switch (criteria) {
        case 'A-Z':
          sortedData.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'Z-A':
          sortedData.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'Newest':
          sortedData.sort((a, b) => new Date(b.updated) - new Date(a.updated));
          break;
        case 'Oldest':
          sortedData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
          break;
        default:
          sortedData = previews;
      }
      return sortedData;
    };

    setFilteredPreviews(sortData(sortCriteria, previews));
  }, [sortCriteria, previews]);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleFavoriteToggle = (podcast) => {
    if (isFavorite(podcast.id)) {
      removeFavorite(podcast.id);
    } else {
      addFavorite(podcast);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="home">
      <h1>Latest Podcasts</h1>
      <div className="filter-buttons">
        <button onClick={() => handleSortChange('All')}>All</button>
        <button onClick={() => handleSortChange('A-Z')}>A-Z</button>
        <button onClick={() => handleSortChange('Z-A')}>Z-A</button>
        <button onClick={() => handleSortChange('Newest')}>Newest</button>
        <button onClick={() => handleSortChange('Oldest')}>Oldest</button>
      </div>
      <ul className="podcast-list">
        {filteredPreviews.map((podcast) => (
          <li key={podcast.id} className="podcast-item">
            <div className="podcast-image">
              <img src={podcast.image} alt={podcast.title} />
            </div>
            <div className="podcast-details">
              <h3>
                <Link to={`/show/${podcast.id}`} className="podcast-link">
                  {podcast.title}
                </Link>
              </h3>
              {/* Access nested properties */}
              <p>Author: {podcast.author}</p> {/* Replace with correct path */}
              <p>Season: {podcast.seasons}</p> {/* Replace with correct path */}
              <p>Genre: {podcast.genres.join(', ')}</p> {/* Replace with correct path */}
              <p>Last Updated: {formatDate(podcast.updated)}</p> {/* Replace with correct path */}
              <div className="action-buttons">
                <AudioPlayer src={podcast.audioSrc} />
                <i
                  className={`fas fa-heart ${isFavorite(podcast.id) ? 'favorite-icon favorite' : 'favorite-icon'}`}
                  onClick={() => handleFavoriteToggle(podcast)}
                ></i>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
