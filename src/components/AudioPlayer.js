import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';

const AudioPlayer = ({ tracks, onTrackSelect, onTrackStop }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsStopped(false);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setIsStopped(true);
    onTrackStop();
  };

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
    onTrackSelect(tracks[index]);
    setIsPlaying(true);
    setIsStopped(false);
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="audio-player" style={{ backgroundColor: '#18191f', color: 'white', padding: '20px', borderRadius: '10px' }}>
      <audio ref={audioRef} src={currentTrack.url} onEnded={handleStop} />
      <div className="playlist" style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: 25}}>
        {tracks.map((track, index) => (
          <div
            key={index}
            onClick={() => handleTrackClick(index)}
            className={`track ${index === currentTrackIndex ? 'active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              border: '2px solid white',
              borderRadius: '10px',
              backgroundColor: index === currentTrackIndex ? '#2D40E6' : '#18191f',
              color: 'white',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {track.title}
          </div>
        ))}
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
