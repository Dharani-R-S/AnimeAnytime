import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const WelcomeToast = ({ username }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="welcome-toast">
      <div className="welcome-toast-content">
        <div className="welcome-icon">👋</div>
        <div className="welcome-message">
          <h3>Welcome back, {username}!</h3>
          <p>Ready to watch some anime?</p>
        </div>
      </div>
    </div>
  );
};

WelcomeToast.propTypes = {
  username: PropTypes.string.isRequired,
};

export default WelcomeToast;
