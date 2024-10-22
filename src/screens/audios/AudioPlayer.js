import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';

const AudioPlayer = ({ tracks, onTrackSelect, onTrackStop }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrack) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrackIndex(null); 
    onTrackStop();
  };

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
    onTrackSelect(tracks[index]);
    setIsPlaying(true);
  };

  return (
    <div className="audio-player" style={{ backgroundColor: '#18191f', color: 'white', padding: '20px', borderRadius: '10px' }}>
      {currentTrack && (
        <audio ref={audioRef} src={currentTrack.url} onEnded={handleStop} />
      )}
      <div className="playlist" style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: 23 }}>
        {tracks.map((track, index) => {
          const isActive = index === currentTrackIndex;
          return (
            <div
              key={index}
              onClick={() => handleTrackClick(index)}
              className={`track ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                border: `2px solid ${isActive ? '#FFA800' : 'white'}`,
                borderRadius: '10px',
                backgroundColor: isActive ? '#FFA800' : '#18191f',
                color: isActive ? 'black' : 'white',
                cursor: 'pointer',
              }}
            >
              {track.title}
            </div>
          );
        })}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton onClick={handleStop} style={{ color: 'white', fontSize: '2rem' }}>
              <StopIcon style={{ fontSize: '2.5rem', color: '#D42A2A' }} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
