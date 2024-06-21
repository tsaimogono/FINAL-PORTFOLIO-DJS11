import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPreviews } from '../services/PodcastService.js';
import { useFavorites } from '../contexts/FavouriteContext.jsx';
import AudioPlayer from './AudioPlayer'; 
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Home = () => {
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const genres = {
    1: 'Personal Growth',
    2: 'Investigative Journalism',
    3: 'History',
    4: 'Comedy',
    5: 'Entertainment',
    6: 'Business',
    7: 'Fiction',
    8: 'News',
    9: 'Kids and Family',
  };

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

  // Handle genre filter change
  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    setSelectedGenre(genreId);
    if (genreId === 'All') {
      setFilteredPreviews(previews);
    } else {
      const filtered = previews.filter(podcast =>
        podcast.genres.includes(parseInt(genreId))
      );
      setFilteredPreviews(filtered);
    }
  };

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterPreviews(event.target.value);
  };

  const filterPreviews = (term) => {
    const filtered = previews.filter(podcast =>
      podcast.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPreviews(filtered);
  };

  if (loading) {
    return <div>Please Wait...</div>;
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
      <h1>Library</h1>
      <div className="filter-bar">
        <select onChange={(e) => handleSortChange(e.target.value)}>
          <option value="All">Order</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="All">Genres</option>
          {Object.entries(genres).map(([id, title]) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
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
              <p>Author: {podcast.author}</p>               
              <p>Genre: {podcast.genres.map(genreId => genres[genreId]).join(', ')}</p> 
              <p>Last Update: {formatDate(podcast.updated)}</p> 
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
