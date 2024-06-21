import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CategoryContext } from './context/CatergoryContext';

import './Header.css'; // Import your CSS file for header styles

const Header = () => {
  const { setSelectedCategory } = useContext(CategoryContext);
  const handleHomeClick = () => {
    setSelectedCategory('All');
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link" onClick={handleHomeClick}>
        {/* SVG logo with neon pink theme */}
        <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <text x="5" y="35" fontSize="28" fontWeight="bold" fill="#f0c">MAGIC</text>
  <text x="110" y="35" fontSize="28" fontWeight="bold" fill="#f0c">VOICE</text>
</svg>

      </Link>
      <nav>
        <ul className="nav-links">
          <li><Link to="/" onClick={handleHomeClick}>Home</Link></li>    
          <li><Link to="/yourfav">Favourites</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
