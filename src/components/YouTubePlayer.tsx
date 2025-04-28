import React from "react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";

type Chapter = {
  label: string;
  time: number; // seconds
};

interface YouTubePlayerProps {
  videoId: string;
  width?: string;
  height?: string;
  chapters: Chapter[];
}

export default function YouTubePlayerWithChapters({
  videoId,
  width = "1080px",
  height = "640px",
  chapters = [],
}: YouTubePlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const jumpTo = (seconds: number) => {
    if (player) {
      const wasPlaying = player.getInternalPlayer().getPlayerState() === 1;
      player.seekTo(seconds, "seconds");
      if (wasPlaying) {
        player.getInternalPlayer().playVideo();
      }
    }
  };

  return (
    <div>
      <ReactPlayer
        ref={setPlayer}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        width={width}
        height={height}
        controls
        config={{
          playerVars: {
            rel: 0,
            showinfo: 0,
            fs: 1,
            iv_load_policy: 3,
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
          },
        }}
      />
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chapters.length > 0 &&
          chapters.map((chapter) => (
            <button
              key={chapter.label}
              onClick={() => jumpTo(chapter.time)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              {chapter.label}
            </button>
          ))}
      </div>
    </div>
  );
}
