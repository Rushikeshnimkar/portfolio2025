// components/tools/githubcontribution.tsx
"use client";

import React from "react";
import GitHubCalendar from "react-github-calendar";

interface GitHubContributionsProps {
  username?: string;
}

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({
  username = "Rushikeshnimkar",
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-full lg:max-w-6xl xl:max-w-7xl overflow-x-auto flex justify-center py-2">
        <GitHubCalendar
          username={username}
          colorScheme="dark"
          blockSize={13}
          blockMargin={4}
          fontSize={13}
          theme={{
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
        />
      </div>
    </div>
  );
};
