import { useEffect, useRef, memo } from "react";

interface Particle {
  x: number;
  y: number;
  z: number; // For 3D depth
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
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const FPS = 45; // Slightly higher for smoother 3D
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
      
      initParticles(width, height);
    };

    const initParticles = (width: number, height: number) => {
      const particleCount = Math.min(60, Math.floor((width * height) / 30000));
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1000, // Depth from 0 to 1000
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          speedZ: (Math.random() - 0.5) * 2,
          opacity: Math.random() * 0.5 + 0.2,
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

    // Mouse interaction
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

      // Clear with subtle trail effect
      ctx.fillStyle = "rgba(8, 12, 21, 0.12)";
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Sort by z for proper depth rendering
      particles.sort((a, b) => b.z - a.z);
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        // Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            particle.x -= dx * force * 0.02;
            particle.y -= dy * force * 0.02;
          }
        }

        // Update position with 3D movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.z += particle.speedZ;

        // Wrap around
        if (particle.x > width) particle.x = 0;
        if (particle.x < 0) particle.x = width;
        if (particle.y > height) particle.y = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.z > 1000) particle.z = 0;
        if (particle.z < 0) particle.z = 1000;

        // Calculate 3D perspective
        const perspective = 600;
        const scale = perspective / (perspective + particle.z);
        const projectedX = centerX + (particle.x - centerX) * scale;
        const projectedY = centerY + (particle.y - centerY) * scale;
        const projectedSize = particle.size * scale;
        const depthOpacity = particle.opacity * scale;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
        
        // Add subtle glow for closer particles
        if (particle.z < 400) {
          ctx.shadowBlur = 8 * scale;
          ctx.shadowColor = "rgba(0, 240, 255, 0.5)";
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = `rgba(0, 240, 255, ${depthOpacity})`;
        ctx.fill();
      }

      // Reset shadow for connections
      ctx.shadowBlur = 0;

      // Draw 3D connections
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i += 2) {
        const p1 = particles[i];
        const scale1 = 600 / (600 + p1.z);
        const x1 = centerX + (p1.x - centerX) * scale1;
        const y1 = centerY + (p1.y - centerY) * scale1;

        for (let j = i + 2; j < particles.length; j += 2) {
          const p2 = particles[j];
          const scale2 = 600 / (600 + p2.z);
          const x2 = centerX + (p2.x - centerX) * scale2;
          const y2 = centerY + (p2.y - centerY) * scale2;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const distSq = dx * dx + dy * dy;

          if (distSq < 15000) {
            const avgScale = (scale1 + scale2) / 2;
            const alpha = 0.1 * (1 - distSq / 15000) * avgScale;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
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
