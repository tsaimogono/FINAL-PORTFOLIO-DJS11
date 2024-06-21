import { useRef, useEffect } from 'react';

const AudioPlayer = ({ src, isPlaying, onPlay, onPause }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleLoadedData = () => {
      console.log('Audio loaded');
      if (isPlaying) {
        audioElement.play().catch((error) => {
          console.error('Play interrupted:', error);
        });
      }
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
    };

    audioElement.addEventListener('loadeddata', handleLoadedData);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('loadeddata', handleLoadedData);
      audioElement.removeEventListener('error', handleError);
    };
  }, [src, isPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (isPlaying) {
      if (audioElement.paused) {
        audioElement.play().catch((error) => {
          console.error('Play interrupted:', error);
        });
      }
    } else {
      if (!audioElement.paused) {
        audioElement.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} />
      {isPlaying ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <button onClick={onPlay}>Play</button>
      )}
    </div>
  );
};

export default AudioPlayer;
