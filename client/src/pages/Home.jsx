import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AnimeList from "../components/AnimeList";

const Home = () => {
  const [topAnime, setTopAnime] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch top-rated anime
    axios
      .get("http://localhost:3001/api/top-anime")
      .then((response) => setTopAnime(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = (query) => {
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Anime Anytime</h1>
          <p className="hero-subtitle">Your gateway to the world of anime</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      <main>
        <section className="top-rated-section">
          <h2 className="section-title">Top Rated Anime</h2>
          <div className="container">
            <div className="anime-grid">
              {topAnime.map((anime) => (
                <div 
                  key={anime.mal_id} 
                  className="anime-card"
                  onClick={() => navigate(`/anime/${anime.mal_id}`, { state: { anime } })}
                >
                  <div className="anime-card-content">
                    <div className="anime-card-image">
                      <img 
                        src={anime.images?.jpg?.image_url || anime.image_url} 
                        alt={anime.title}
                      />
                      {anime.score && (
                        <div className="anime-rating">★ {anime.score}</div>
                      )}
                    </div>
                    <div className="anime-card-overlay">
                      <h3 className="anime-card-title">{anime.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;