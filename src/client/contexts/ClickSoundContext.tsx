import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import clickSrc from '../../../assets/click.ogg';

type ClickSoundContextValue = {
  play: () => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const ClickSoundContext = createContext<ClickSoundContextValue | null>(null);

export function ClickSoundProvider({ children }: PropsWithChildren) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    void fetch(clickSrc)
      .then((res) => res.arrayBuffer())
      .then((buffer) => audioContext.decodeAudioData(buffer))
      .then((decoded) => {
        audioBufferRef.current = decoded;
      });

    return () => {
      void audioContext.close();
    };
  }, []);

  const play = useCallback(() => {
    if (isMuted) return;

    const audioContext = audioContextRef.current;
    const audioBuffer = audioBufferRef.current;
    if (!audioContext || !audioBuffer) return;

    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <ClickSoundContext.Provider value={{ play, isMuted, toggleMute }}>
      {children}
    </ClickSoundContext.Provider>
  );
}

export function useClickSound() {
  const context = useContext(ClickSoundContext);
  if (!context) {
    throw new Error('useClickSound must be used within ClickSoundProvider');
  }
  return context.play;
}

export function useSoundSettings() {
  const context = useContext(ClickSoundContext);
  if (!context) {
    throw new Error('useSoundSettings must be used within ClickSoundProvider');
  }
  return { isMuted: context.isMuted, toggleMute: context.toggleMute };
}
