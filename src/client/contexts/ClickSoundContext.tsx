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
import linkClickSrc from '../../../assets/link-click.wav';

const SOUND_SOURCES = {
  button: clickSrc,
  link: linkClickSrc,
} as const;

type SoundType = keyof typeof SOUND_SOURCES;

type ClickSoundContextValue = {
  play: (type: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const ClickSoundContext = createContext<ClickSoundContextValue | null>(null);

export function ClickSoundProvider({ children }: PropsWithChildren) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<SoundType, AudioBuffer>>(new Map());
  const [isMuted, setIsMuted] = useState(false);

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
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <ClickSoundContext.Provider value={{ play, isMuted, toggleMute }}>
      {children}
    </ClickSoundContext.Provider>
  );
}

export function useClickSound(type: SoundType = 'button') {
  const context = useContext(ClickSoundContext);
  if (!context) {
    throw new Error('useClickSound must be used within ClickSoundProvider');
  }
  return useCallback(() => context.play(type), [context.play, type]);
}

export function useSoundSettings() {
  const context = useContext(ClickSoundContext);
  if (!context) {
    throw new Error('useSoundSettings must be used within ClickSoundProvider');
  }
  return { isMuted: context.isMuted, toggleMute: context.toggleMute };
}
