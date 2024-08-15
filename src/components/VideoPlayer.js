// src/components/VideoPlayer.js
import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url }) => {
  return <ReactPlayer url={url} controls={true} />;
};

export default VideoPlayer;
