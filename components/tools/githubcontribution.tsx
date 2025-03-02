// components/GitHubCalendar.tsx
"use client";
import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";

interface GitHubContributionsProps {
  username: string;
}

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({
  username,
}) => {
  // Define the theme according to the new format
  const theme = {
    dark: [
      "rgba(22, 27, 34, 0.5)", // level0
      "rgba(14, 68, 41, 0.8)", // level1
      "rgba(0, 109, 50, 0.8)", // level2
      "rgba(38, 166, 65, 0.8)", // level3
      "rgba(57, 211, 83, 0.8)", // level4
    ],
  };

  // State for responsive sizes
  const [blockSize, setBlockSize] = useState(15);
  const [fontSize, setFontSize] = useState(14);
  const [blockMargin, setBlockMargin] = useState(4);

  // Update sizes based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Small mobile screens
        setBlockSize(8);
        setFontSize(10);
        setBlockMargin(2);
      } else if (width < 768) {
        // Larger mobile screens
        setBlockSize(10);
        setFontSize(12);
        setBlockMargin(3);
      } else if (width < 1024) {
        // Tablets
        setBlockSize(12);
        setFontSize(13);
        setBlockMargin(3);
      } else {
        // Desktop
        setBlockSize(15);
        setFontSize(14);
        setBlockMargin(4);
      }
    };

    // Set initial sizes
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div
        className="github-calendar-wrapper"
        style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ minWidth: "750px" }}>
          <GitHubCalendar
            username={username}
            theme={theme}
            hideColorLegend={true}
            hideMonthLabels={false}
            fontSize={fontSize}
            blockSize={blockSize}
            blockMargin={blockMargin}
            labels={{
              totalCount: "{{count}} contributions in the last year",
            }}
          />
        </div>
      </div>
    </div>
  );
};
