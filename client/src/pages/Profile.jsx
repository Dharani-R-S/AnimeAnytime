import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCollection();
  }, [user, navigate]);

  const fetchCollection = async () => {
    try {
      const response = await axios.get('https://animeanytime-backend.onrender.com/api/collection', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCollection(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch collection');
      setLoading(false);
    }
  };

  const handleRemoveFromCollection = async (animeId, e) => {
    e.stopPropagation(); // Prevent triggering card click
    try {
      await axios.delete(`https://animeanytime-backend.onrender.com/api/collection/remove/${animeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCollection(collection.filter(anime => anime.animeId !== animeId));
    } catch (err) {
      setError('Failed to remove from collection');
    }
  };

  const handleAnimeClick = async (anime) => {
    try {
      // Fetch full anime details from Jikan API
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${anime.animeId}`);
      const animeDetails = response.data.data;

      // Navigate to anime details with the full data
      navigate(`/anime/${anime.animeId}`, {
        state: {
          anime: {
            mal_id: animeDetails.mal_id,
            title: animeDetails.title,
            synopsis: animeDetails.synopsis,
            score: animeDetails.score,
            rating: animeDetails.rating,
            episodes: animeDetails.episodes,
            status: animeDetails.status,
            aired: animeDetails.aired,
            duration: animeDetails.duration,
            genres: animeDetails.genres,
            images: {
              jpg: {
                image_url: anime.image_url,
                large_image_url: anime.image_url
              }
            },
            trailer: animeDetails.trailer,
            studios: animeDetails.studios,
            source: animeDetails.source
          }
        }
      });
    } catch (err) {
      console.error('Error fetching anime details:', err);
      // Fallback to basic navigation with available data
      navigate(`/anime/${anime.animeId}`, {
        state: {
          anime: {
            mal_id: anime.animeId,
            title: anime.title,
            images: {
              jpg: {
                image_url: anime.image_url,
                large_image_url: anime.image_url
              }
            },
            score: anime.rating
          }
        }
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="profile-container">
      <div className="profile-header">
        <h1>My Collection</h1>
        {collection.length > 0 && (
          <div className="collection-message">
            {collection.length} {collection.length === 1 ? 'anime' : 'animes'} in your collection
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : collection.length === 0 ? (
        <div className="empty-collection">
          <h2>Your collection is empty</h2>
          <p>Start adding some anime to your collection!</p>
        </div>
      ) : (
        <div className="anime-grid">
          {collection.map((anime) => (
            <div 
              key={anime.animeId} 
              className="anime-card"
              onClick={() => handleAnimeClick(anime)}
            >
              <div className="anime-card-content">
                <div className="anime-card-image">
                  <img 
                    src={anime.image_url} 
                    alt={anime.title}
                  />
                  {anime.rating && (
                    <div className="anime-rating">★ {anime.rating}</div>
                  )}
                </div>
                <div className="anime-card-overlay">
                  <h3 className="anime-card-title">{anime.title}</h3>
                  <button 
                    className="remove-collection-button"
                    onClick={(e) => handleRemoveFromCollection(anime.animeId, e)}
                  >
                    Remove from Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Profile;
