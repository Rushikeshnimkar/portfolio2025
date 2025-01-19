"use client";
import { useEffect, useRef } from "react";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

interface SparklesProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}

export const SparklesCore = ({
  id = "tsparticles",
  className,
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  particleColor = "#FFFFFF"
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();
  const particles = useRef<Array<Particle>>([]);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === canvas) {
          canvas.width = entry.contentRect.width;
          canvas.height = entry.contentRect.height;
        }
      }
    });

    resizeObserver.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const createParticles = () => {
      const density = particleDensity * (canvas.width * canvas.height) / (1920 * 1080);
      particles.current = Array.from({ length: density }, () => new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        minSize + Math.random() * (maxSize - minSize),
        particleColor
      ));
    };

    createParticles();

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(particle => {
        particle.update(canvas.width, canvas.height, mousePosition);
        particle.draw(ctx);
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [minSize, maxSize, particleDensity, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("opacity-50", className)}
      style={{
        background,
      }}
    />
  );
};

class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
  }

  update(width: number, height: number, mousePosition: { x: number; y: number }) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    // Optional: Add mouse interaction
    const dx = mousePosition.x - this.x;
    const dy = mousePosition.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.x -= dx * 0.01;
      this.y -= dy * 0.01;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
