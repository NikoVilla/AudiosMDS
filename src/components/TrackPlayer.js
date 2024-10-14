import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';

const TrackPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/files')
      .then((response) => {
        const formattedTracks = response.data.map(file => ({
          url: file.url,
          title: file.title,
          tags: [file.title],
          imageUrl: file.imageUrl
        }));
        setTracks(formattedTracks);
        console.log('Fetched tracks:', formattedTracks);
      })
      .catch((error) => {
        console.error('Error fetching tracks', error);
      });
  }, []);

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    axios.post('http://localhost:3001/select-track', track, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      console.log('Track selected and sent to server:', track);
    })
    .catch((error) => {
      console.error('Error sending track to server', error);
    });
  };

  return (
    <div>
      {tracks.length > 0 ? (
        <AudioPlayer
          tracks={tracks}
          onTrackSelect={handleTrackSelect}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrackPlayer;