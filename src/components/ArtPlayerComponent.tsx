import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import { usePlayerStore } from '@/hooks/use-store';
import { FastForward } from 'lucide-react';

interface Props {
  url: string;
  poster: string;
  title: string;
  onEnded?: () => void;
  showSkipIntro?: boolean;
}

/**
 * Enhanced ArtPlayer Component
 * Includes custom keyboard shortcuts, volume persistence, and premium overlays.
 */
export default function ArtPlayerComponent({ url, poster, title, onEnded, showSkipIntro = true }: Props) {
  const artRef = useRef<HTMLDivElement>(null);
  const { volume, setVolume } = usePlayerStore();

  useEffect(() => {
    if (!artRef.current) return;

    const art = new Artplayer({
      container: artRef.current,
      url,
      poster,
      title,
      volume,
      autoplay: true,
      pip: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      theme: '#eab308',
      controls: [
        {
          position: 'right',
          html: 'Next',
          index: 1,
          style: { marginRight: '10px', cursor: 'pointer' },
          click: function () {
            if (onEnded) onEnded();
          },
        },
      ],
      // Custom Keyboard Shortcuts
      hotkey: true,
    });

    // Custom "Skip Intro" Layer
    if (showSkipIntro) {
      art.layers.add({
        name: 'skip-intro',
        html: `<div class="bg-black/80 border border-white/20 px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-black transition-all font-bold uppercase text-[10px]">Skip Intro</div>`,
        style: {
          position: 'absolute',
          bottom: '80px',
          right: '20px',
          display: 'none',
        },
        click: function () {
          art.seek = art.currentTime + 75; // Skip 85 seconds
        },
      });

      // Show Skip button during first 2 minutes
      art.on('video:timeupdate', () => {
        const layer = art.layers['skip-intro'];
        if (art.currentTime > 10 && art.currentTime < 85) {
          layer.style.display = 'flex';
        } else {
          layer.style.display = 'none';
        }
      });
    }

    // Persist Volume Changes
    art.on('video:volumechange', () => {
      setVolume(art.volume);
    });

    if (onEnded) art.on('video:ended', onEnded);

    return () => {
      if (art && art.destroy) art.destroy(false);
    };
  }, [url, poster, title, onEnded, showSkipIntro]);

  return <div ref={artRef} className="w-full aspect-video bg-black shadow-2xl" />;
}