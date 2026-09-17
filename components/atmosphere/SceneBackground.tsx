"use client";

/**
 * Dark night-desk light only. No monuments, no orbiting cubes.
 */
export default function SceneBackground() {
  return (
    <div
      id="scene-background"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05060a]"
    >
      {/* Lamp — upper right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 82% 8%, rgba(212,166,86,0.16), transparent 58%)",
        }}
      />
      {/* Monitor — left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 8% 55%, rgba(110,180,200,0.08), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 40%, transparent 30%, rgba(5,6,10,0.55) 100%)",
        }}
      />
    </div>
  );
}
