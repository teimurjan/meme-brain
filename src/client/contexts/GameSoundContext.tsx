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
import linkClickSrc from '../../../assets/link-click.ogg';
import { readMuted, writeMuted } from '../utils/localStorage';

const SOUND_SOURCES = {
  button: clickSrc,
  link: linkClickSrc,
} as const;

type SoundType = keyof typeof SOUND_SOURCES;

type GameSoundContextValue = {
  play: (type: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const GameSoundContext = createContext<GameSoundContextValue | null>(null);

export function GameSoundProvider({ children }: PropsWithChildren) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<SoundType, AudioBuffer>>(new Map());
  const [isMuted, setIsMuted] = useState(readMuted);

  useEffect(() => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const entries = Object.entries(SOUND_SOURCES) as [SoundType, string][];

    for (const [key, src] of entries) {
      void fetch(src)
        .then((res) => res.arrayBuffer())
        .then((buffer) => audioContext.decodeAudioData(buffer))
        .then((decoded) => {
          buffersRef.current.set(key, decoded);
        });
    }

    return () => {
      void audioContext.close();
    };
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (isMuted) return;

      const audioContext = audioContextRef.current;
      const audioBuffer = buffersRef.current.get(type);
      if (!audioContext || !audioBuffer) return;

      if (audioContext.state === 'suspended') {
        void audioContext.resume();
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      writeMuted(next);
      return next;
    });
  }, []);

  return (
    <GameSoundContext.Provider value={{ play, isMuted, toggleMute }}>
      {children}
    </GameSoundContext.Provider>
  );
}

export function useGameSound(type: SoundType = 'button') {
  const context = useContext(GameSoundContext);
  if (!context) {
    throw new Error('useGameSound must be used within GameSoundProvider');
  }
  const { play } = context;
  return useCallback(() => play(type), [play, type]);
}

export function useSoundSettings() {
  const context = useContext(GameSoundContext);
  if (!context) {
    throw new Error('useSoundSettings must be used within GameSoundProvider');
  }
  return { isMuted: context.isMuted, toggleMute: context.toggleMute };
}
