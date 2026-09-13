import { useState } from "react";

export const useSongChange = (token: string) => {
  const [songId, setSongId] = useState(''); 
  
    async function changeSong() {
      console.log('changing song');

      const songObject = {
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

    return { songId, setSongId, changeSong };
};