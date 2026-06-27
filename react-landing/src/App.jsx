import VideoBackground from './components/VideoBackground';
import Navbar from './components/Navbar';
import HeroContent from './components/HeroContent';

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <VideoBackground />
      <Navbar />
      <HeroContent />
    </div>
  );
}
