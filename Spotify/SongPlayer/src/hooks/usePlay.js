const usePlay = () => {    
    const play = async (token, deviceId, songId = null) => {
        console.log('playing track');

        let bodyObject = null;
        if (songId) {
            bodyObject = {
                position_ms: 0,
              uris: [`spotify:track:${songId}`]
            };
        }
        else {
            bodyObject = {
                position_ms: 0
            };
        }

        const response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObject)
        });

        if (!response.ok) {
            console.error('Failed to play track', response.status, response.statusText);
            return;
        }
        else {
            console.log('Successfully played track');
        }
    }

    return play;
}

export default usePlay;