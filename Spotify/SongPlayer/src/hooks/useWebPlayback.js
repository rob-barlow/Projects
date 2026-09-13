import { useState, useEffect } from "react";

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

const useWebPlayback = (token) => {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [device_id, setDeviceId] = useState('');
    const [stateChanging, setStateChanging] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                setDeviceId(device_id);
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {
                setStateChanging(stateChanging => !stateChanging);
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(true);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

                console.log('Player state changed:', JSON.stringify(state));
            }));

            player.connect();
        };
    }, []);

    // const play = () => {
    //     player.t
    // }

    return { is_paused, is_active, player, current_track, device_id, stateChanging };
}

export default useWebPlayback;