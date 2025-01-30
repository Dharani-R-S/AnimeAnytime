import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AnimeList = ({ animeList }) => {
  const navigate = useNavigate();

  return (
    <div className="anime-grid">
      {animeList.map((anime) => (
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
  );
};

AnimeList.propTypes = {
  animeList: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      images: PropTypes.object,
      image_url: PropTypes.string,
      title: PropTypes.string.isRequired,
      score: PropTypes.number,
    })
  ).isRequired,
};

export default AnimeList;