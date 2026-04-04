import { useEffect, useRef, memo } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  size: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const ParticleBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const isVisibleRef = useRef(true);
  const nodesRef = useRef<Node[]>([]);
  const starsRef = useRef<Star[]>([]);
  const lastTimeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const FPS = 45;
  const frameInterval = 1000 / FPS;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initNodes(width, height);
      initStars(width, height);
    };

    const initNodes = (width: number, height: number) => {
      // More nodes, widely spread
      const nodeCount = Math.min(90, Math.floor((width * height) / 18000));
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 800,
          size: Math.random() * 2.5 + 1,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math.random() - 0.5) * 0.6,
          speedZ: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.6 + 0.3,
        });
      }
    };

    const initStars = (width: number, height: number) => {
      // Tiny twinkling star particles
      const starCount = Math.min(40, Math.floor((width * height) / 30000));
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.6 + 0.2,
          opacity: Math.random() * 0.15 + 0.05,
          twinkleSpeed: Math.random() * 0.01 + 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    resizeCanvas();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationRef.current) {
        lastTimeRef.current = performance.now();
        animate(lastTimeRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = (currentTime: number) => {
      if (!isVisibleRef.current) {
        animationRef.current = undefined;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTimeRef.current;
      if (elapsed < frameInterval) return;
      lastTimeRef.current = currentTime - (elapsed % frameInterval);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear fully each frame - no trail effect
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const stars = starsRef.current;
      const mouse = mouseRef.current;

      // === Draw twinkling stars ===
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const alpha = star.opacity * (0.3 + twinkle * 0.7);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.5})`;
        ctx.fill();
      }

      // Sort nodes by z for depth
      nodes.sort((a, b) => b.z - a.z);

      // === Draw network connections (thin lines) ===
      ctx.shadowBlur = 0;
      const perspective = 600;
      const maxConnectionDist = 22000; // wider connection range

      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        const scale1 = perspective / (perspective + p1.z);
        const x1 = centerX + (p1.x - centerX) * scale1;
        const y1 = centerY + (p1.y - centerY) * scale1;

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const scale2 = perspective / (perspective + p2.z);
          const x2 = centerX + (p2.x - centerX) * scale2;
          const y2 = centerY + (p2.y - centerY) * scale2;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectionDist) {
            const avgScale = (scale1 + scale2) / 2;
            const alpha = 0.12 * (1 - distSq / maxConnectionDist) * avgScale;
            ctx.beginPath();
            ctx.lineWidth = 0.5 * avgScale;
            ctx.strokeStyle = `rgba(100, 180, 220, ${alpha})`;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // === Draw and update nodes ===
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Mouse interaction - gentle push
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            node.x -= dx * force * 0.015;
            node.y -= dy * force * 0.015;
          }
        }

        // Update position
        node.x += node.speedX;
        node.y += node.speedY;
        node.z += node.speedZ;

        // Wrap around
        if (node.x > width) node.x = 0;
        if (node.x < 0) node.x = width;
        if (node.y > height) node.y = 0;
        if (node.y < 0) node.y = height;
        if (node.z > 800) node.z = 0;
        if (node.z < 0) node.z = 800;

        // 3D projection
        const scale = perspective / (perspective + node.z);
        const projectedX = centerX + (node.x - centerX) * scale;
        const projectedY = centerY + (node.y - centerY) * scale;
        const projectedSize = node.size * scale;
        const depthOpacity = node.opacity * scale;

        // Draw node dot with subtle glow
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);

        ctx.shadowBlur = 0;

        ctx.fillStyle = `rgba(140, 200, 240, ${depthOpacity})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    };

    animate(performance.now());

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
});

ParticleBackground.displayName = "ParticleBackground";

export default ParticleBackground;
