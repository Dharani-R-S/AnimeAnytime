import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      fetch(`https://animeanytime-backend.onrender.com/api/search?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to fetch search results");
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container">
        <div className="error-message">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-results">
          <h2>No results found for "{query}"</h2>
          <p>Try different keywords or check your spelling</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h2 className="search-title">
          Search Results for "{query}"
        </h2>
        <p className="search-count">
          {searchResults.length} results found
        </p>
      </div>

      <div className="search-results">
        <h2>Search Results</h2>
        <div className="anime-grid">
          {searchResults.map((anime) => (
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
    </div>
  );
};

export default SearchResults;