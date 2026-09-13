import { useEffect } from 'react';

export const useSongChange = (songId, token) => {
    useEffect(() => {
      async function changeSong(songId) {
        console.log('changing song');

        let songObject = {
          uris: [`spotify:track:${songId}`]
        };

        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(songObject)
        });
      }
  
      changeSong(songId);
  
    }, []);
};