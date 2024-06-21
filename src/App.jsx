
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Yourfav from './components/YourFav';
import Show from './components/Show';
import Footer from './components/Footer';
import { CategoryProvider } from './components/context/CatergoryContext';
import { FavoritesProvider } from './contexts/FavouriteContext';

const App = () => {
  return (
    <CategoryProvider>
      <FavoritesProvider>
        <Router>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/yourfav" element={<Yourfav />} />
              <Route path="/show/:showId" element={<Show /> }/>
            </Routes>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </CategoryProvider>
  );
};

export default App;
