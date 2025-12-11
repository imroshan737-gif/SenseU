import { useState, useEffect, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Trophy, RotateCcw } from "lucide-react";

interface MiniGameProps {
  className?: string;
}

type GameTile = {
  id: number;
  color: string;
  isActive: boolean;
  isMatched: boolean;
};

const colors = [
  "bg-primary",
  "bg-secondary", 
  "bg-emerald-500",
  "bg-amber-500",
];

const MiniGame = memo(({ className }: MiniGameProps) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("neuroaura_game_highscore") || "0");
  });
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [level, setLevel] = useState(1);

  // Initialize tiles
  useEffect(() => {
    setTiles(
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        color: colors[i],
        isActive: false,
        isMatched: false,
      }))
    );
  }, []);

  const flashTile = useCallback((id: number, duration = 300) => {
    setActiveTile(id);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setActiveTile(null);
        setTimeout(resolve, 100);
      }, duration);
    });
  }, []);

  const showSequence = useCallback(async () => {
    setIsShowingSequence(true);
    for (const tileId of sequence) {
      await flashTile(tileId, 400);
    }
    setIsShowingSequence(false);
  }, [sequence, flashTile]);

  const startGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setPlayerSequence([]);
    const firstTile = Math.floor(Math.random() * 4);
    setSequence([firstTile]);
    setIsPlaying(true);
  }, []);

  const addToSequence = useCallback(() => {
    const newTile = Math.floor(Math.random() * 4);
    setSequence((prev) => [...prev, newTile]);
    setPlayerSequence([]);
    setLevel((l) => l + 1);
  }, []);

  useEffect(() => {
    if (isPlaying && sequence.length > 0 && !isShowingSequence) {
      const timer = setTimeout(showSequence, 500);
      return () => clearTimeout(timer);
    }
  }, [sequence, isPlaying, showSequence, isShowingSequence]);

  const handleTileClick = useCallback(
    async (id: number) => {
      if (!isPlaying || isShowingSequence) return;

      await flashTile(id, 200);
      const newPlayerSequence = [...playerSequence, id];
      setPlayerSequence(newPlayerSequence);

      // Check if correct
      const currentIndex = newPlayerSequence.length - 1;
      if (sequence[currentIndex] !== id) {
        // Wrong tile - game over
        setIsPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("neuroaura_game_highscore", score.toString());
        }
        return;
      }

      // Correct tile
      setScore((s) => s + 10);

      // Check if sequence complete
      if (newPlayerSequence.length === sequence.length) {
        setTimeout(addToSequence, 800);
      }
    },
    [isPlaying, isShowingSequence, playerSequence, sequence, flashTile, addToSequence, score, highScore]
  );

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">
            Mind Match
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-orbitron text-amber-400">{score}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-primary" />
            <span className="text-xs font-orbitron text-primary">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 gap-2 aspect-square max-w-[160px] mx-auto">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => handleTileClick(tile.id)}
            disabled={!isPlaying || isShowingSequence}
            className={cn(
              "rounded-xl transition-all duration-200",
              "border border-border/30",
              tile.color,
              activeTile === tile.id
                ? "opacity-100 scale-95 shadow-lg"
                : "opacity-40 hover:opacity-60",
              (!isPlaying || isShowingSequence) && "cursor-default"
            )}
            style={{
              boxShadow:
                activeTile === tile.id
                  ? `0 0 20px currentColor, inset 0 0 10px rgba(255,255,255,0.3)`
                  : undefined,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 text-center">
        {!isPlaying ? (
          <button
            onClick={startGame}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-sm font-orbitron hover:bg-primary/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {score > 0 ? "Play Again" : "Start Game"}
          </button>
        ) : (
          <p className="text-xs text-muted-foreground font-orbitron">
            Level {level} • {isShowingSequence ? "Watch..." : "Your turn!"}
          </p>
        )}
      </div>
    </div>
  );
});

MiniGame.displayName = "MiniGame";

export default MiniGame;
