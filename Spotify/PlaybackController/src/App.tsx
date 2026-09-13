import './App.css'
import { useSongChange } from './hooks/useSongChange';
import useToken from './hooks/useToken';
import useDevice from './hooks/useDevice';
import useSearch from './hooks/useSearch';

function App() {
  const token = useToken();
  
  const {songId, setSongId, changeSong}= useSongChange(token);
  const {deviceId, setDeviceId, moveToDevice} = useDevice(token);
  const {searchQuery, setSearchQuery, searchResults, searchSpotify} = useSearch(token);

  return (
    <div className="App">
      <h1>Playback Controller</h1>

      <input
        type="text"
        placeholder="Enter device ID" 
        value={deviceId} 
        onChange={e => setDeviceId(e.target.value)} />

      <button onClick={moveToDevice}>Move to Computer</button>


      <input
        type="text"
        placeholder="Enter search query" 
        value={searchQuery} 
        onChange={e => setSearchQuery(e.target.value)} />

      <button onClick={searchSpotify}>Search songs</button>

      <ul>
        {searchResults.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map((artist: any) => artist.name).join(', ')}
            <p>Song ID: {track.id}</p>
          </li>
        ))}
      </ul>
      
      <input
        type="text"
        placeholder="Enter song ID" 
        value={songId} 
        onChange={e => setSongId(e.target.value)} />
      <button onClick={changeSong}>Set song</button>
    </div>
  )
}

export default App
