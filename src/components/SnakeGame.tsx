import { useState, useEffect, useCallback, useRef, memo } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Trophy, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Heart, Target } from "lucide-react";

interface SnakeGameProps {
  className?: string;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
type PowerUpType = "speed" | "points" | "shrink";

interface PowerUp {
  position: Position;
  type: PowerUpType;
  expiresAt: number;
}

const GRID_SIZE = 14;
const INITIAL_SPEED = 180;
const MIN_SPEED = 80;

const SnakeGame = memo(({ className }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [powerUp, setPowerUp] = useState<PowerUp | null>(null);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("neuroaura_snake_highscore") || "0");
  });
  const [gameOver, setGameOver] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastFoodTime = useRef(Date.now());

  const generatePosition = useCallback((exclude: Position[]): Position => {
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (exclude.some(p => p.x === pos.x && p.y === pos.y));
    return pos;
  }, []);

  const spawnParticles = useCallback((pos: Position) => {
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      x: pos.x,
      y: pos.y,
      id: Date.now() + i,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 500);
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generatePosition(initialSnake));
    setPowerUp(null);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setCombo(0);
    setSpeedBoost(false);
    setGameOver(false);
    setParticles([]);
    lastFoodTime.current = Date.now();
  }, [generatePosition]);

  const startGame = useCallback(() => {
    resetGame();
    setIsPlaying(true);
  }, [resetGame]);

  // Spawn power-ups occasionally
  useEffect(() => {
    if (!isPlaying || powerUp) return;
    
    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.3 && !powerUp) {
        const types: PowerUpType[] = ["speed", "points", "shrink"];
        const type = types[Math.floor(Math.random() * types.length)];
        setPowerUp({
          position: generatePosition([...snake, food]),
          type,
          expiresAt: Date.now() + 5000,
        });
      }
    }, 3000);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, powerUp, snake, food, generatePosition]);

  // Remove expired power-ups
  useEffect(() => {
    if (!powerUp) return;
    const timeout = setTimeout(() => {
      if (Date.now() >= powerUp.expiresAt) {
        setPowerUp(null);
      }
    }, powerUp.expiresAt - Date.now());
    return () => clearTimeout(timeout);
  }, [powerUp]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDirection = directionRef.current;
      
      let newHead: Position;
      switch (currentDirection) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          return prevSnake;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsPlaying(false);
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("neuroaura_snake_highscore", score.toString());
        }
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setIsPlaying(false);
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("neuroaura_snake_highscore", score.toString());
        }
        return prevSnake;
      }

      let newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const timeSinceLastFood = Date.now() - lastFoodTime.current;
        const quickEat = timeSinceLastFood < 2000;
        const comboBonus = quickEat ? combo + 1 : 0;
        setCombo(comboBonus);
        
        const points = 10 + (comboBonus * 5) + (speedBoost ? 10 : 0);
        setScore(s => s + points);
        setFood(generatePosition(newSnake));
        spawnParticles(newHead);
        lastFoodTime.current = Date.now();
        return newSnake;
      }

      // Check power-up collision
      if (powerUp && newHead.x === powerUp.position.x && newHead.y === powerUp.position.y) {
        spawnParticles(newHead);
        
        switch (powerUp.type) {
          case "speed":
            setSpeedBoost(true);
            setTimeout(() => setSpeedBoost(false), 5000);
            break;
          case "points":
            setScore(s => s + 50);
            break;
          case "shrink":
            if (newSnake.length > 2) {
              newSnake = newSnake.slice(0, -2);
            }
            break;
        }
        setPowerUp(null);
      }

      // Remove tail
      newSnake.pop();
      return newSnake;
    });
  }, [food, generatePosition, score, highScore, powerUp, combo, speedBoost, spawnParticles]);

  // Game loop with dynamic speed
  useEffect(() => {
    if (isPlaying) {
      const speed = speedBoost 
        ? Math.max(MIN_SPEED, INITIAL_SPEED - Math.min(score, 100) - 40)
        : Math.max(MIN_SPEED, INITIAL_SPEED - Math.min(score, 100));
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, moveSnake, score, speedBoost]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      const currentDir = directionRef.current;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const handleDirectionButton = (newDir: Direction) => {
    if (!isPlaying) return;
    const currentDir = directionRef.current;
    
    if (
      (newDir === "UP" && currentDir !== "DOWN") ||
      (newDir === "DOWN" && currentDir !== "UP") ||
      (newDir === "LEFT" && currentDir !== "RIGHT") ||
      (newDir === "RIGHT" && currentDir !== "LEFT")
    ) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  };

  const getPowerUpIcon = (type: PowerUpType) => {
    switch (type) {
      case "speed": return <Zap className="w-2 h-2" />;
      case "points": return <Star className="w-2 h-2" />;
      case "shrink": return <Heart className="w-2 h-2" />;
    }
  };

  const getPowerUpColor = (type: PowerUpType) => {
    switch (type) {
      case "speed": return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]";
      case "points": return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]";
      case "shrink": return "bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">
            Zen Snake
          </span>
        </div>
        <div className="flex items-center gap-3">
          {combo > 0 && (
            <div className="flex items-center gap-1 animate-pulse">
              <Target className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-orbitron text-emerald-400">x{combo}</span>
            </div>
          )}
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

      {/* Speed boost indicator */}
      {speedBoost && (
        <div className="absolute top-8 right-0 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 animate-pulse">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[9px] font-orbitron text-amber-400">BOOST!</span>
        </div>
      )}

      {/* Game Grid */}
      <div 
        className={cn(
          "relative mx-auto rounded-lg overflow-hidden border border-border/30 bg-muted/20 transition-all duration-300",
          speedBoost && "border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
        )}
        style={{ 
          width: GRID_SIZE * 11 + 4,
          height: GRID_SIZE * 11 + 4,
        }}
      >
        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-primary rounded-full animate-ping pointer-events-none"
            style={{
              left: p.x * 11 + 2,
              top: p.y * 11 + 2,
            }}
          />
        ))}
        
        {/* Grid cells */}
        <div 
          className="grid gap-px p-0.5"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const snakeIndex = snake.findIndex(seg => seg.x === x && seg.y === y);
            const isSnake = snakeIndex !== -1;
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;
            const isPowerUp = powerUp && powerUp.position.x === x && powerUp.position.y === y;

            return (
              <div
                key={index}
                className={cn(
                  "w-[9px] h-[9px] rounded-sm transition-all duration-75 flex items-center justify-center",
                  isHead && "bg-primary shadow-[0_0_8px_rgba(0,240,255,0.9)] scale-110",
                  isSnake && !isHead && cn(
                    "bg-primary/70",
                    snakeIndex <= 2 && "bg-primary/80",
                    snakeIndex > snake.length - 3 && "bg-primary/50"
                  ),
                  isFood && "bg-secondary shadow-[0_0_10px_rgba(138,43,226,0.9)] animate-pulse scale-110",
                  isPowerUp && cn(getPowerUpColor(powerUp.type), "animate-bounce"),
                  !isSnake && !isFood && !isPowerUp && "bg-muted/20"
                )}
              >
                {isPowerUp && getPowerUpIcon(powerUp.type)}
              </div>
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <p className="text-sm font-orbitron text-destructive mb-1">Game Over</p>
              <p className="text-xs text-muted-foreground mb-0.5">Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-[10px] text-primary animate-pulse">🎉 New High Score!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Power-up Legend */}
      {isPlaying && (
        <div className="mt-2 flex justify-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-amber-400" />
            <span className="text-[8px] text-muted-foreground">Speed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-emerald-400" />
            <span className="text-[8px] text-muted-foreground">+50pts</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-pink-400" />
            <span className="text-[8px] text-muted-foreground">Shrink</span>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="mt-3 flex flex-col items-center gap-1">
        {isPlaying ? (
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => handleDirectionButton("UP")}
              className="p-1.5 rounded bg-muted/30 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />
            <button
              onClick={() => handleDirectionButton("LEFT")}
              className="p-1.5 rounded bg-muted/30 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDirectionButton("DOWN")}
              className="p-1.5 rounded bg-muted/30 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all active:scale-95"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDirectionButton("RIGHT")}
              className="p-1.5 rounded bg-muted/30 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-orbitron hover:bg-primary/30 hover:scale-105 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            {gameOver ? "Play Again" : "Start Game"}
          </button>
        )}
      </div>
      
      {isPlaying && (
        <p className="text-[9px] text-center text-muted-foreground mt-2 font-orbitron">
          Arrow keys / WASD • Eat fast for combos!
        </p>
      )}
    </div>
  );
});

SnakeGame.displayName = "SnakeGame";

export default SnakeGame;
