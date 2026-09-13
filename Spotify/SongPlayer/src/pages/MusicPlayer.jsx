import WebPlayback from '../components/WebPlayback'
import useWebPlayback from '../hooks/useWebPlayback';
import useDevice from '../hooks/useDevice';
import { useSearchParams } from "react-router-dom";
import { useSongChange } from '../hooks/useSongChange'
import { useState, useEffect } from 'react';
import usePlay from '../hooks/usePlay';

export default function MusicPlayer(params) {
    const [searchParams] = useSearchParams();
    const songId = searchParams.get("song_id");
    
    const [start, setStart] = useState(false);

    const { is_paused, is_active, player, current_track, device_id, stateChanging } = useWebPlayback(params.token);
    
    // const moveToDevice = useDevice();
    // const ChangeSong = useSongChange();
    const play = usePlay();

    const wait = async (ms) => {
        console.log("Waiting for " + ms + " milliseconds");
        await new Promise(resolve => setTimeout(resolve, ms));
        setStart(true);
        console.log("playinggg" );

    }

    useEffect(() => {
        if (device_id) {
            console.log("Moving playback to device: " + device_id);
            play(params.token, device_id, songId);
            
            console.log("Playing player");
            
            wait(3023);
        }
    }, [device_id]);

    useEffect(() => {
        if (player.duration - player.position < 1000){
            console.log("Song finished");
            window.parent.postMessage(
            { type: "songFinished", id: "song_id" },
            "*"
            );
        }
    }, [stateChanging]);

    useEffect(() => {
        if (start){
            console.log("Resuming player");
            player.togglePlay()
        }
    }, [start]);

    // useEffect(() => {

    return (
        <WebPlayback is_paused={is_paused} is_active={is_active} player={player} current_track={current_track} /> 
    );
}