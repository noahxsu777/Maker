import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

// Public HLS test stream (Big Buck Bunny via Mux)
const HLS_SRC = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export default function VideoBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ startLevel: -1, autoStartLoad: true });
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      video.src = HLS_SRC;
      video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
    }
  }, []);

  return (
    <>
      {/* HLS video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Cinematic gradient overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        background: `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.50) 0%,
            rgba(0,0,0,0.10) 35%,
            rgba(0,0,0,0.15) 60%,
            rgba(0,0,0,0.72) 100%
          ),
          linear-gradient(
            to right,
            rgba(0,0,0,0.45) 0%,
            transparent 60%
          )
        `,
      }} />
    </>
  );
}
