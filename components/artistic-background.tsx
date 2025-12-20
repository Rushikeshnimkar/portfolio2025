"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ArtisticBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Particle system for ambient effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Modern cyan/purple/teal color palette for particles
        const colors = [
            "rgba(6, 182, 212, 0.3)",    // Cyan
            "rgba(139, 92, 246, 0.25)",   // Purple
            "rgba(20, 184, 166, 0.25)",   // Teal
            "rgba(236, 72, 153, 0.2)",    // Pink
            "rgba(99, 102, 241, 0.2)",    // Indigo
            "rgba(14, 165, 233, 0.25)",   // Sky
        ];

        interface Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            opacity: number;
        }

        const particles: Particle[] = [];
        const particleCount = 60;

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.6 + 0.2,
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle with glow effect
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = particle.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base gradient - Deep navy with subtle color hints */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a]" />

            {/* Cyan orb - Top left */}
            <motion.div
                className="absolute w-[700px] h-[700px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }}
                animate={{
                    x: ["-10%", "15%", "-10%"],
                    y: ["-5%", "10%", "-5%"],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ top: "-15%", left: "-10%" }}
            />

            {/* Purple orb - Right side */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
                    filter: "blur(70px)",
                }}
                animate={{
                    x: ["10%", "-20%", "10%"],
                    y: ["5%", "-15%", "5%"],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ top: "50%", right: "-10%" }}
            />

            {/* Teal orb - Bottom */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
                animate={{
                    x: ["-5%", "25%", "-5%"],
                    y: ["10%", "-10%", "10%"],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ bottom: "10%", left: "20%" }}
            />

            {/* Pink accent orb - Subtle */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
                    filter: "blur(50px)",
                }}
                animate={{
                    x: ["5%", "-15%", "5%"],
                    y: ["-10%", "15%", "-10%"],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ top: "40%", left: "50%" }}
            />

            {/* Indigo orb - Center accent */}
            <motion.div
                className="absolute w-[450px] h-[450px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
                    filter: "blur(55px)",
                }}
                animate={{
                    x: ["-8%", "12%", "-8%"],
                    y: ["8%", "-12%", "8%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ bottom: "30%", right: "30%" }}
            />

            {/* Particle canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

            {/* Subtle noise overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Subtle grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
                    backgroundSize: "100px 100px",
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 0%, rgba(10, 15, 26, 0.5) 100%)",
                }}
            />
        </div>
    );
}
