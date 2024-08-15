// src/components/VideoPlayerWithSeek.js
import React, { useRef } from "react";
import ReactPlayer from "react-player";

/**
 * seekStops
 * {
 *   seekToSeconds: number;
 *   seekTitle: string;
 * }[]
 */
const VideoPlayerWithSeek = ({ url, seekStops }) => {
  const playerRef = useRef(null);

  const seekTo = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  return (
    <div>
      <ReactPlayer ref={playerRef} url={url} controls={true} width={800} />
      {/* <div className="flex flex-row flex-wrap w-[800px] border-solid border-red-600 space-x-2"> */}
      <div
        className="grid grid-cols-3 w-[800px] border-solid  border-purple-600 gap-2"
        style={{ borderWidth: "0.5px" }}
      >
        {seekStops &&
          seekStops.map((el, index) => {
            return (
              <a
                href="#"
                className="underline px-4"
                onClick={(e) => {
                  e.preventDefault();
                  seekTo(el.seekToSeconds);
                }}
              >
                {`${index + 1}. ${el.seekTitle}`}
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default VideoPlayerWithSeek;
