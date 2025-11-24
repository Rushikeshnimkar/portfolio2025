// components/GitHubCalendar.tsx
"use client";
import React from "react";

interface GitHubContributionsProps {
  username: string;
}

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({
  username,
}) => {
  const snakeUrl = `https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg`;
  const fallbackSnakeUrl = `https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg`;

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-full lg:max-w-6xl xl:max-w-7xl overflow-hidden">
        <img
          src={snakeUrl}
          alt="GitHub Contributions"
          className="w-full"
          style={{
            maxHeight: '400px',
            objectFit: 'cover',
            objectPosition: 'top'
          }}
          onError={(e) => {
            e.currentTarget.src = fallbackSnakeUrl;
          }}
        />
      </div>
    </div>
  );
};
