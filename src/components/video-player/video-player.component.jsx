import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import './video-player.component.css'; // Import custom CSS for styling

const VideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true, // Makes the player responsive
        playbackRates: [0.5, 1, 1.5, 2], // Playback speed options
        controlBar: {
          volumePanel: {
            inline: false,
          },
        },
        techOrder: ["html5"],
        html5: {
          hls: {
            overrideNative: true,
          },
          xhr: {
            timeout: 45000, // Increase timeout to 45 seconds
          },
        },
        sources: [
          { src: videoSrc, type: "video/mp4" },
          { src: videoSrc, type: "video/webm" },
          { src: videoSrc, type: "video/ogg" },
          { src: videoSrc, type: "video/mkv" }, // Add mkv support
          { src: videoSrc, type: "video/avi" },
        ],
      });

      // Enable hotkeys
      playerRef.current.ready(() => {
        playerRef.current.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
        });
      });

      // Log player readiness
      playerRef.current.on('ready', () => {
        console.log('Video.js player is ready');
      });

      // Log player errors
      playerRef.current.on('error', (error) => {
        console.error('Video.js player error:', error);
      });

      // Cleanup on unmount
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [videoSrc]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
