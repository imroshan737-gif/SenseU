import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface Track {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

interface MusicContextType {
  isEnabled: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: Track | null;
  tracks: Track[];
  customTracks: Track[];
  currentTrackIndex: number;
  toggleEnabled: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  addCustomTrack: (file: File) => void;
}

const builtInTracks: Track[] = [
  { id: "rain", name: "Gentle Rain", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { id: "forest", name: "Forest Ambience", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_6c5d91f3c0.mp3" },
  { id: "ocean", name: "Ocean Waves", url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1e6c2.mp3" },
  { id: "meditation", name: "Meditation Bell", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_55f78a08d1.mp3" },
];

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allTracks = [...builtInTracks, ...customTracks];
  const currentTrack = allTracks[currentTrackIndex] || null;

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const playTrack = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play().catch((e) => {
        console.error("Audio play error:", e);
        toast.error("Could not play audio. Try a different track.");
      });
      setIsPlaying(true);
    }
  }, []);

  const toggleEnabled = useCallback(() => {
    if (isEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
    setIsEnabled(!isEnabled);
  }, [isEnabled]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src !== currentTrack.url) {
        audioRef.current.src = currentTrack.url;
      }
      audioRef.current.play().catch((e) => {
        console.error("Audio play error:", e);
        toast.error("Could not play audio");
      });
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
  }, []);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % allTracks.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlaying && allTracks[nextIndex]) {
      playTrack(allTracks[nextIndex]);
    }
  }, [currentTrackIndex, allTracks, isPlaying, playTrack]);

  const prevTrack = useCallback(() => {
    const prevIndex = currentTrackIndex === 0 ? allTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    if (isPlaying && allTracks[prevIndex]) {
      playTrack(allTracks[prevIndex]);
    }
  }, [currentTrackIndex, allTracks, isPlaying, playTrack]);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    if (isPlaying && allTracks[index]) {
      playTrack(allTracks[index]);
    }
  }, [isPlaying, allTracks, playTrack]);

  const addCustomTrack = useCallback((file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast.error("Please upload an audio file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB allowed.");
      return;
    }

    const url = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      url,
      isCustom: true,
    };

    setCustomTracks((prev) => [...prev, newTrack]);
    setCurrentTrackIndex(allTracks.length);
    toast.success("Track added successfully");
  }, [allTracks.length]);

  return (
    <MusicContext.Provider
      value={{
        isEnabled,
        isPlaying,
        isMuted,
        volume,
        currentTrack,
        tracks: builtInTracks,
        customTracks,
        currentTrackIndex,
        toggleEnabled,
        togglePlay,
        toggleMute,
        setVolume,
        nextTrack,
        prevTrack,
        selectTrack,
        addCustomTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
