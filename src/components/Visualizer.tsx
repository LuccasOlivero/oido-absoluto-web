'use client';

import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isPlaying: boolean;
  intensity?: number;
}

export function Visualizer({ isPlaying, intensity = 1 }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;
    const barCount = 28;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount - 3;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;

        if (isPlaying) {
          const freq = Math.sin(phase + i * 0.35) * Math.cos(phase * 0.8 + i * 0.25);
          const base = Math.abs(freq);
          barHeight = Math.max(6, base * (height * 0.8) * intensity);
        } else {
          barHeight = 4 + Math.sin(phase * 0.4 + i * 0.25) * 1.5;
        }

        const x = i * (barWidth + 3) + 2;
        const y = (height - barHeight) / 2;

        // Pastel gradients: Soft Lilac -> Soft Peach -> Soft Mint
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#C4B5FD'); // pastel purple
          gradient.addColorStop(0.5, '#FDBA74'); // pastel peach
          gradient.addColorStop(1, '#6EE7B7'); // pastel mint
        } else {
          gradient.addColorStop(0, '#E7E5E4'); // stone-200
          gradient.addColorStop(1, '#D6D3D1'); // stone-300
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, barHeight, 4);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      phase += isPlaying ? 0.16 : 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, intensity]);

  return (
    <div className="w-full h-14 flex items-center justify-center bg-stone-100/80 rounded-2xl p-2 border border-stone-200/60 shadow-inner">
      <canvas
        ref={canvasRef}
        width={300}
        height={48}
        className="w-full h-full max-w-xs"
      />
    </div>
  );
}
