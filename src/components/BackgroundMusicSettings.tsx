import { useRef } from "react";
import { Music, Upload, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useMusic } from "@/contexts/MusicContext";

interface BackgroundMusicSettingsProps {
  className?: string;
}

export default function BackgroundMusicSettings({ className }: BackgroundMusicSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isEnabled,
    isPlaying,
    isMuted,
    volume,
    currentTrack,
    tracks,
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
  } = useMusic();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addCustomTrack(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const allTracks = [...tracks, ...customTracks];

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
              onClick={toggleMute}
              className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <Slider
              value={[volume]}
              onValueChange={(val) => setVolume(val[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
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
