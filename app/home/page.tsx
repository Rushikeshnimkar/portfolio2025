"use client";
import Image from "next/image";

import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Head from "next/head";
import MagneticButton from "@/components/ui/magnetic-button";
import { TiltCard } from "@/components/ui/tilt-card";

// Define image metadata for SEO
const imageMetadata = {
  profile1: {
    url: "/rushikesh_nimkar.jpg",
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

export default function HomePage() {

  return (
    <>
      {/* Add structured data for images to be indexed by Google */}
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
          {/* Profile Image Section - Modern Asymmetric Design */}
          <div
            id="home-profile-section"
            className="flex-1 flex justify-center relative order-1 md:order-2"
          >
            <TiltCard className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div
                id="home-profile-image-container"
                className="w-full h-full"
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 filter blur-[80px] -z-10" />

                {/* Main image container with glassmorphism */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-black/20">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl z-20" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-xl z-20" />

                  {/* Image container - Static Image */}
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0">
                      <Image
                        src={imageMetadata.profile1.url}
                        alt={imageMetadata.profile1.alt}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Floating tech badge */}
                <div
                  className="absolute -bottom-4 -right-4 bg-neutral-900/90 border border-cyan-500/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-xl z-30"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono text-cyan-400">OPEN TO WORK</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Text Content Section */}
          <div
            id="home-text-content"
            className="flex-1 text-center md:text-left space-y-4 md:space-y-8 order-2 md:order-1"
          >
            <div id="home-title" className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl font-bold">
              <span className="text-white">Hi, I&apos;m</span> <br className="hidden sm:block" />
              <span className="text-blue-500">Rushikesh Nimkar</span>
            </div>

            <div id="home-subtitle" className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400">
              <span className="text-gray-400">Full Stack Developer | Tech Enthusiast</span>
            </div>

            <p
              id="home-description"
              className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto md:mx-0"
            >
              I turn coffee into code and bugs into features. Full-stack
              developer who enjoys building digital puzzles and occasionally
              solving them. Currently exploring blockchain, because why not add
              more blocks to my stacks?
            </p>

            <div
              id="home-action-buttons"
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0"
            >
              <div
                id="home-main-buttons"
                className="flex flex-row gap-4 items-center"
              >
                {/* CV Button */}
                <MagneticButton>
                  <div
                    id="home-cv-button-wrapper"
                    className="relative w-[140px] overflow-hidden rounded-md group"
                  >
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                    <button
                      onClick={() => (window.location.href = "/resume")}
                      className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <span className="text-white">View CV</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
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
                  </div>
                </MagneticButton>

                {/* Sponsor Button */}
                <MagneticButton>
                  <div
                    id="home-sponsor-button-wrapper"
                    className="relative w-[140px] overflow-hidden rounded-md group"
                  >
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                    <button
                      onClick={() =>
                        window.open(
                          "https://github.com/sponsors/Rushikeshnimkar",
                          "_blank"
                        )
                      }
                      className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <span className="text-white">Sponsor</span>
                      <svg
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        className="text-red-500"
                        fill="currentColor"
                      >
                        <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z" />
                      </svg>
                    </button>
                  </div>
                </MagneticButton>
              </div>

              {/* Social Links */}
              <div
                id="home-social-links"
                className="flex gap-6 items-center mt-4 sm:mt-0"
              >
                <MagneticButton>
                  <a
                    href="https://github.com/Rushikeshnimkar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 block p-2"
                  >
                    <FaGithub size={24} />
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 block p-2"
                  >
                    <FaLinkedin size={24} />
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://x.com/RushikeshN22296"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 block p-2"
                  >
                    <FaXTwitter size={24} />
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://discord.com/users/748192618659315753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 block p-2"
                  >
                    <FaDiscord size={24} />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
