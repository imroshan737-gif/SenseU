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

const ParticleBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const isVisibleRef = useRef(true);
  const nodesRef = useRef<Node[]>([]);
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(width, height);
    };

    const initNodes = (width: number, height: number) => {
      // Even grid-based distribution to avoid clustering
      const count = Math.min(100, Math.floor((width * height) / 15000));
      const cols = Math.ceil(Math.sqrt(count * (width / height)));
      const rows = Math.ceil(count / cols);
      const cellW = width / cols;
      const cellH = height / rows;

      nodesRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (nodesRef.current.length >= count) break;
          nodesRef.current.push({
            x: cellW * c + Math.random() * cellW,
            y: cellH * r + Math.random() * cellH,
            z: Math.random() * 600,
            size: Math.random() * 1.8 + 0.8,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            speedZ: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
          });
        }
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
    const handleMouseLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationRef.current) {
        lastTimeRef.current = performance.now();
        animate(lastTimeRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const animate = (currentTime: number) => {
      if (!isVisibleRef.current) { animationRef.current = undefined; return; }
      animationRef.current = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTimeRef.current;
      if (elapsed < frameInterval) return;
      lastTimeRef.current = currentTime - (elapsed % frameInterval);

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const perspective = 600;
      const maxConnDist = 28000;

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            node.x -= dx * force * 0.01;
            node.y -= dy * force * 0.01;
          }
        }
        node.x += node.speedX;
        node.y += node.speedY;
        node.z += node.speedZ;
        if (node.x > width) node.x = 0;
        if (node.x < 0) node.x = width;
        if (node.y > height) node.y = 0;
        if (node.y < 0) node.y = height;
        if (node.z > 600) node.z = 0;
        if (node.z < 0) node.z = 600;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        const s1 = perspective / (perspective + p1.z);
        const x1 = width / 2 + (p1.x - width / 2) * s1;
        const y1 = height / 2 + (p1.y - height / 2) * s1;

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const s2 = perspective / (perspective + p2.z);
          const x2 = width / 2 + (p2.x - width / 2) * s2;
          const y2 = height / 2 + (p2.y - height / 2) * s2;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnDist) {
            const avgS = (s1 + s2) / 2;
            const alpha = 0.1 * (1 - distSq / maxConnDist) * avgS;
            ctx.beginPath();
            ctx.lineWidth = 0.4 * avgS;
            ctx.strokeStyle = `rgba(100, 180, 220, ${alpha})`;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (tiny dots, no circles/particles)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const scale = perspective / (perspective + node.z);
        const px = width / 2 + (node.x - width / 2) * scale;
        const py = height / 2 + (node.y - height / 2) * scale;
        const ps = node.size * scale;
        const alpha = node.opacity * scale;

        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(130, 190, 230, ${alpha * 0.7})`;
        ctx.fill();
      }
    };

    animate(performance.now());

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(resizeTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
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
