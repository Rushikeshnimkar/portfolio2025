"use client";
import { useEffect, useRef } from "react";
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
  particleDensity = 40,
  particleColor = "#FFFFFF",
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      const density = Math.max(
        12,
        Math.floor((particleDensity * (w * h)) / (1920 * 1080))
      );
      particles.current = Array.from(
        { length: density },
        () =>
          new Particle(
            Math.random() * w,
            Math.random() * h,
            minSize + Math.random() * (maxSize - minSize),
            particleColor
          )
      );
    };

    resize();

    const animate = () => {
      if (!running.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles.current) {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      }
      animationFrame.current = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          animationFrame.current = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrame.current);
        }
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      running.current = false;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(animationFrame.current);
    };
  }, [minSize, maxSize, particleDensity, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("opacity-50", className)}
      style={{ background }}
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

  update(width: number, height: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
