"use client";

import { useEffect, useRef } from 'react';
import type Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    // Only initialize Plyr on the client side
    if (typeof window !== 'undefined' && videoRef.current && !playerRef.current) {
      import('plyr').then(({ default: Plyr }) => {
        if (videoRef.current) {
          playerRef.current = new Plyr(videoRef.current, {
            controls: [
              'play-large',
              'play',
              'progress',
              'current-time',
              'mute',
              'volume',
              'captions',
              'settings',
              'pip',
              'fullscreen'
            ]
          });
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full aspect-video">
      <video ref={videoRef} className="w-full">
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}