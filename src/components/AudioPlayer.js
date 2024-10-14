import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const AudioPlayer = ({ tracks, onTrackSelect }) => {
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
    onTrackSelect(tracks[currentTrackIndex]);
  }, [isPlaying, currentTrackIndex, tracks, onTrackSelect]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsStopped(false);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setIsStopped(true);
  };

  const handleRestart = () => {
    audioRef.current.currentTime = 0;
    setIsPlaying(true);
    setIsStopped(false);
  };

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setIsStopped(false);
  };

  return (
    <div className="audio-player" style={{ backgroundColor: '#18191f', color: 'white', padding: '20px', borderRadius: '10px' }}>
      <audio ref={audioRef} src={tracks[currentTrackIndex].url} onEnded={() => setIsPlaying(false)} />
      <div className="playlist" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
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
                <StopIcon style={{ fontSize: '2.5rem', color:'#D42A2A'}} />
                </IconButton>
                {/* <Typography style={{ color: 'white' }}>Pausa</Typography> */}
            </div>
            {isStopped && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <IconButton onClick={handleRestart} style={{ color: 'white', fontSize: '2rem' }}>
                    <RestartAltIcon style={{ fontSize: '2rem' }} />
                </IconButton>
                {/* <Typography style={{ color: 'white' }}>Reiniciar</Typography> */}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;