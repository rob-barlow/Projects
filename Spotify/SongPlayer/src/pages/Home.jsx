import MusicPlayer from './MusicPlayer'
import Login from '../components/Login'
import { useToken } from '../hooks/useToken'
import '../Home.css';

function Home() {
  const token = useToken();

  return (
    <>
        { (token === '') ? <Login/> : <MusicPlayer token={token} /> }
    </>
  );
}


export default Home;
