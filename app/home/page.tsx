"use client";
import Image from "next/image";

import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Head from "next/head";
import MagneticButton from "@/components/ui/magnetic-button";
import { ChalkWrite, ChalkWords } from "@/components/ui/ChalkWrite";

const imageMetadata = {
  profile1: {
    url: "/rushikesh_nimkar.png",
    alt: "Rushikesh Nimkar - Full Stack Developer Primary Profile",
    width: 800,
    height: 800,
  },
  profile2: {
    url: "/profile.jpg",
    alt: "Rushikesh Nimkar - Full Stack Developer Alternate Profile",
    width: 800,
    height: 800,
  },
};

const socials = [
  { href: "https://github.com/Rushikeshnimkar", icon: FaGithub, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  { href: "https://x.com/RushikeshN22296", icon: FaXTwitter, label: "X" },
  {
    href: "https://discord.com/users/748192618659315753",
    icon: FaDiscord,
    label: "Discord",
  },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rushikesh Nimkar",
              url: "https://rushikeshnimkar.com",
              image: [
                `https://rushikeshnimkar.com${imageMetadata.profile1.url}`,
                `https://rushikeshnimkar.com${imageMetadata.profile2.url}`,
              ],
              jobTitle: "Full Stack Developer",
              description:
                "Full Stack Developer specializing in Next.js, TypeScript, and Blockchain development.",
            }),
          }}
        />
      </Head>

      <main
        id="home"
        className="container mx-auto px-4 min-h-screen flex items-center justify-center pt-16 md:pt-0"
      >
        <div
          id="home-content-wrapper"
          className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl w-full py-8 md:py-0"
        >
          <ChalkWrite
            delay={0.15}
            asMedia
            className="flex-1 flex justify-center relative order-1 md:order-2"
          >
            <div
              id="home-profile-section"
              className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96"
            >
              <div id="home-profile-image-container" className="w-full h-full">
                <div className="absolute inset-0 bg-ocean-aqua/20 filter blur-[70px] -z-10" />

                <div className="relative w-full h-full overflow-hidden rounded-3xl neon-border bg-ocean-surface/40">
                  <Image
                    src={imageMetadata.profile1.url}
                    alt={imageMetadata.profile1.alt}
                    fill
                    className="object-cover object-[center_32%]"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-midnight/50 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-3 -right-3 glass-strong px-4 py-2 z-30 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-teal opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-ocean-teal" />
                    </span>
                    <span className="text-xs font-medium tracking-widest uppercase text-ocean-cyan">
                      open to work
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ChalkWrite>

          <div
            id="home-text-content"
            className="flex-1 text-center md:text-left space-y-5 md:space-y-7 order-2 md:order-1"
          >
            <ChalkWrite delay={0}>
              <span className="chip">Full Stack Developer · Tech Enthusiast</span>
            </ChalkWrite>

            <ChalkWrite delay={0.1} className="block">
              <div
                id="home-title"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.05]"
              >
                <span className="text-ocean-ice">Hi, I&apos;m</span>
                <br />
                <span className="text-gradient-ocean text-glow">
                  <ChalkWords text="Rushikesh Nimkar" delay={0.2} />
                </span>
              </div>
            </ChalkWrite>

            <ChalkWrite delay={0.25}>
              <p
                id="home-description"
                className="text-base sm:text-lg md:text-xl text-ocean-mist max-w-xl mx-auto md:mx-0 leading-relaxed"
              >
                I turn coffee into code and bugs into features. A full-stack
                developer who enjoys building digital puzzles and occasionally
                solving them — currently exploring blockchain, because why not add
                more blocks to my stack?
              </p>
            </ChalkWrite>

            <ChalkWrite delay={0.4}>
              <div
                id="home-action-buttons"
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2"
              >
                <div
                  id="home-main-buttons"
                  className="flex flex-row gap-4 items-center"
                >
                  <MagneticButton>
                    <button
                      onClick={() => (window.location.href = "/resume")}
                      className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-sm md:text-base font-semibold text-ocean-midnight bg-gradient-to-r from-ocean-aqua to-ocean-cyan shadow-glow transition-transform hover:scale-[1.03]"
                    >
                      View CV
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </button>
                  </MagneticButton>

                  <MagneticButton>
                    <button
                      onClick={() =>
                        window.open(
                          "https://github.com/sponsors/Rushikeshnimkar",
                          "_blank"
                        )
                      }
                      className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-sm md:text-base font-semibold text-ocean-ice glass neon-border transition-transform hover:scale-[1.03]"
                    >
                      Sponsor
                      <svg
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        className="text-ocean-aqua"
                        fill="currentColor"
                      >
                        <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z" />
                      </svg>
                    </button>
                  </MagneticButton>
                </div>

                <div
                  id="home-social-links"
                  className="flex gap-3 items-center mt-2 sm:mt-0"
                >
                  {socials.map(({ href, icon: Icon, label }) => (
                    <MagneticButton key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="grid place-items-center w-10 h-10 rounded-xl text-ocean-mist hover:text-ocean-aqua glass hover:neon-border transition-all duration-300"
                      >
                        <Icon size={20} />
                      </a>
                    </MagneticButton>
                  ))}
                </div>
              </div>
            </ChalkWrite>

            <ChalkWrite delay={0.55}>
              <div className="hidden md:flex items-center gap-2 pt-6 text-ocean-mist/70 text-xs tracking-[0.2em] uppercase">
                <span className="animate-float-bob">↓</span> scroll
              </div>
            </ChalkWrite>
          </div>
        </div>
      </main>
    </>
  );
}
