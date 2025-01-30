import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anime/${anime.mal_id}`, { state: { anime } });
  };

  return (
    <div className="anime-card shadow-lg" onClick={handleClick}>
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full h-full object-cover"
      />
      <div className="anime-info">
        <h3 className="anime-title">{anime.title}</h3>
        <div className="anime-details">
          <span>{anime.type || 'TV'}</span>
          {anime.episodes && <span> • {anime.episodes} episodes</span>}
          {anime.score && <span> • ⭐ {anime.score}</span>}
        </div>
      </div>
    </div>
  );
};

AnimeCard.propTypes = {
  anime: PropTypes.shape({
    mal_id: PropTypes.number.isRequired,
    images: PropTypes.shape({
      jpg: PropTypes.shape({
        image_url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    episodes: PropTypes.number,
    score: PropTypes.number,
  }).isRequired,
};

export default AnimeCard;
