const useDevice = () => {    
    const moveToDevice = async (deviceId, token) => {
        console.log('moving playback to device', deviceId);
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device_ids: [deviceId],
                play: true
            })
        });

        if (!response.ok) {
            console.error('Failed to move playback to device', response.status, response.statusText);
            return;
        }
        else {
            console.log('Successfully moved playback to device', deviceId);
        }
    }

    return moveToDevice;
}

export default useDevice;