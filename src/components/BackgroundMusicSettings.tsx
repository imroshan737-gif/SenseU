import { useState, useRef, useEffect, useCallback } from "react";
import { Music, Upload, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BackgroundMusicSettingsProps {
  className?: string;
}

interface Track {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

// Built-in calming tracks (using royalty-free ambient sounds)
const builtInTracks: Track[] = [
  { id: "rain", name: "Gentle Rain", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { id: "forest", name: "Forest Ambience", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_6c5d91f3c0.mp3" },
  { id: "ocean", name: "Ocean Waves", url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1e6c2.mp3" },
  { id: "meditation", name: "Meditation Bell", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_55f78a08d1.mp3" },
];

export default function BackgroundMusicSettings({ className }: BackgroundMusicSettingsProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<Track[]>(builtInTracks);
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTracks = [...tracks, ...customTracks];
  const currentTrack = allTracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume[0] / 100;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTrack) {
        if (!audioRef.current.src || audioRef.current.src !== currentTrack.url) {
          audioRef.current.src = currentTrack.url;
        }
        audioRef.current.play().catch((e) => {
          console.error("Audio play error:", e);
          toast.error("Could not play audio");
        });
        setIsPlaying(true);
      }
    }
  }, [isPlaying, currentTrack]);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % allTracks.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlaying) {
      playTrack(allTracks[nextIndex]);
    }
  }, [currentTrackIndex, allTracks, isPlaying, playTrack]);

  const prevTrack = useCallback(() => {
    const prevIndex = currentTrackIndex === 0 ? allTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    if (isPlaying) {
      playTrack(allTracks[prevIndex]);
    }
  }, [currentTrackIndex, allTracks, isPlaying, playTrack]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [allTracks.length]);

  const toggleEnabled = useCallback(() => {
    if (isEnabled) {
      // Disable
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
    setIsEnabled(!isEnabled);
  }, [isEnabled]);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    if (isPlaying) {
      playTrack(allTracks[index]);
    }
  }, [isPlaying, allTracks, playTrack]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary flex items-center gap-2">
          <Music className="w-4 h-4" />
          Background Music
        </h3>
        <button
          onClick={toggleEnabled}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            isEnabled ? "bg-primary" : "bg-muted"
          )}
        >
          <div
            className={cn(
              "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
              isEnabled ? "translate-x-6" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-4 animate-fade-in">
          {/* Current Track */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Now Playing</p>
            <p className="text-sm font-medium text-foreground truncate">
              {currentTrack?.name || "Select a track"}
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTrack}
              className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <SkipBack className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary" />
              ) : (
                <Play className="w-6 h-6 text-primary" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <SkipForward className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Built-in Tracks</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={cn(
                    "w-full p-2 rounded-lg text-left text-sm transition-colors",
                    currentTrackIndex === index
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-muted/30 text-foreground"
                  )}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tracks */}
          {customTracks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Tracks</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {customTracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(tracks.length + index)}
                    className={cn(
                      "w-full p-2 rounded-lg text-left text-sm transition-colors",
                      currentTrackIndex === tracks.length + index
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted/30 text-foreground"
                    )}
                  >
                    {track.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 rounded-xl border border-dashed border-border/50 hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Upload className="w-4 h-4" />
            Upload Your Own Music
          </button>
        </div>
      )}
    </div>
  );
}
