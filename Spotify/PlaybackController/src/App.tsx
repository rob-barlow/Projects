import { useState } from 'react';
import './App.css'
import { useSongChange } from './hooks/useSongChange';
import { useToken } from './hooks/useToken';

function App() {
  const token = useToken();
  const changeSong = useSongChange(token);
  const [songId, setSongId] = useState(''); 

  return (
    <>
      <h1>Playback Controller</h1>
      <button>Move to Computer</button>
      <input
        type="text"
        placeholder="Enter song ID" 
        value={songId} 
        onChange={e => setSongId(e.target.value)} />
      <button onClick={() => changeSong(songId)}>Set song</button>
    </>
  )
}

export default App
