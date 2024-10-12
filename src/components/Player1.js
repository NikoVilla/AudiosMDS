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

const Player1 = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/files')
      .then((response) => {
        const fetchedTracks = response.data.map(file => ({
          url: file.url,
          title: file.title,
          tags: [file.title]
        }));
        setTracks(fetchedTracks);
      })
      .catch((error) => {
        console.error('Error fetching tracks', error);
      });
  }, []);

  return (
    <div>
      {tracks.length > 0 ? (
        <Player
          trackList={tracks}
          includeTags={false}
          includeSearch={false}
          showPlaylist={true}
          sortTracks={true}
          autoPlayNextTrack={true}
          customColorScheme={colors}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Player1;