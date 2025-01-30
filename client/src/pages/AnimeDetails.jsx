import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AnimeDetails = () => {
  const location = useLocation();
  const anime = location.state.anime;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [collectionMessage, setCollectionMessage] = useState("");
  const [collectionMessageType, setCollectionMessageType] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);

  // Format the rating to be more readable
  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return rating.replace(/_/g, ' ').replace(/^rated /i, '');
  };

  const handleAddToCollection = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCollection(true);
      const response = await axios.post('http://localhost:3001/api/collection/add', {
        animeId: anime.mal_id,
        title: anime.title,
        image_url: anime.images.jpg.image_url
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setCollectionMessage(response.data.message || "Added to collection!");
      setCollectionMessageType("success");
      setIsInCollection(true);
    } catch (error) {
      console.error('Error adding to collection:', error.response?.data || error);
      setCollectionMessage(error.response?.data?.message || "Error adding to collection");
      setCollectionMessageType("error");
    } finally {
      setAddingToCollection(false);
      setTimeout(() => {
        setCollectionMessage("");
        setCollectionMessageType("");
      }, 3000);
    }
  };

  return (
    <div className="anime-details-container">
      <div className="anime-details">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>←</span> Go Back
        </button>
        
        <div className="anime-details-top">
          <div className="anime-details-left">
            <img 
              src={anime.images.jpg.image_url} 
              alt={anime.title} 
              className="anime-poster"
            />
            <div className="anime-score-badge">
              <span>{anime.score || "N/A"}</span>
              <small>Score</small>
            </div>
            {user && (
              <button
                className="add-to-collection"
                onClick={handleAddToCollection}
                disabled={isInCollection}
              >
                {isInCollection ? 'In Collection' : 'Add to Collection'}
              </button>
            )}
            {collectionMessage && (
              <div className={`collection-status-message ${collectionMessageType}`}>
                {collectionMessage}
              </div>
            )}
          </div>
          
          <div className="anime-details-right">
            <div className="anime-titles">
              <h1 className="anime-title">{anime.title}</h1>
              {anime.title_japanese && (
                <h2 className="anime-title-jp">{anime.title_japanese}</h2>
              )}
            </div>
            
            <div className="anime-stats">
              <div className="stat-item">
                <span className="stat-label">Rating</span>
                <span className="stat-value">{formatRating(anime.rating)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Episodes</span>
                <span className="stat-value">{anime.episodes || "N/A"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className="stat-value">{anime.status || "N/A"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Type</span>
                <span className="stat-value">{anime.type || "N/A"}</span>
              </div>
            </div>

            <div className="anime-genres">
              {anime.genres.map((genre) => (
                <span key={genre.name} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="anime-details-bottom">
          <div className="anime-synopsis">
            <h2>Synopsis</h2>
            <p>{anime.synopsis || "No synopsis available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;