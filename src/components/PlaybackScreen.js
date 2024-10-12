import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaybackScreen = () => {
  const location = useLocation();
  const { track } = location.state || {};

  if (!track) {
    return <div>No track selected</div>;
  }

  return (
    <div className="PlaybackScreen">
      <img src={track.imageUrl} alt={track.title} style={{ width: '100%', height: 'auto' }} />
      <audio controls autoPlay>
        <source src={track.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default PlaybackScreen;
