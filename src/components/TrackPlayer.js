import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Player from "@madzadev/audio-player";

const colors = {
  tagsBackground: "#FFC801",
  tagsText: "#ffffff",
  tagsBackgroundHoverActive: "#6e65f1",
  tagsTextHoverActive: "#ffffff",
  searchBackground: "#18191f",
  searchText: "#ffffff",
  searchPlaceHolder: "#575a77",
  playerBackground: "#18191f",
  titleColor: "#ffffff",
  timeColor: "#ffffff",
  progressSlider: "#FFC801",
  progressUsed: "#ffffff",
  progressLeft: "#151616",
  bufferLoaded: "#1f212b",
  volumeSlider: "#FFC801",
  volumeUsed: "#ffffff",
  volumeLeft: "#151616",
  playlistBackground: "#18191f",
  playlistText: "#575a77",
  playlistBackgroundHoverActive: "#18191f",
  playlistTextHoverActive: "#ffffff",
};

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
        <Player
          trackList={tracks}
          includeTags={false}
          includeSearch={false}
          showPlaylist={true}
          sortTracks={true}
          autoPlayNextTrack={false}
          customColorScheme={colors}
          onTrackClick={handleTrackSelect}  // Aquí se envía automáticamente el mensaje
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrackPlayer;

