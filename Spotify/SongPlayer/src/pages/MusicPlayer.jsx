import WebPlayback from '../components/WebPlayback'
import useWebPlayback from '../hooks/useWebPlayback';
import useDevice from '../hooks/useDevice';
// import { useSearchParams } from "react-router-dom";
// import { useSongChange } from '../hooks/useSongChange'
// import { useEffect } from 'react';

export default function MusicPlayer(params) {
    // const [params] = useSearchParams();
    const { is_paused, is_active, player, current_track, device_id } = useWebPlayback(params.token);
    
    useDevice(device_id, params.token);
    // const songId = params.get("song_id");

    // const ChangeSong = useSongChange(token);

    // useEffect(() => {
    //     if (songId && is_active) {
    //         console.log("Changing song to: " + songId);
    //         ChangeSong(songId);
    //     }
    // }, [is_active]);

    return (
        <WebPlayback is_paused={is_paused} is_active={is_active} player={player} current_track={current_track} /> 
    );
}