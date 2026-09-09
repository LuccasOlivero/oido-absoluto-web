'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { SnippetDuration } from '@/types';

export interface YouTubeEngineRef {
  playSnippet: (duration: SnippetDuration, startSeconds?: number) => void;
  playFull: (startSeconds?: number) => void;
  stop: () => void;
  cueSong: (videoId: string, startSeconds?: number) => void;
}

interface YouTubeEngineProps {
  videoId?: string;
  onPlayStateChange: (isPlaying: boolean) => void;
  onProgressChange: (progress: number) => void;
  onBufferingStateChange?: (isBuffering: boolean) => void;
  onErrorFallback?: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: Record<string, unknown>
      ) => YTPlayerInterface;
    };
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface YTPlayerInterface {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  cueVideoById: (options: { videoId: string; startSeconds?: number }) => void;
  loadVideoById: (options: { videoId: string; startSeconds?: number }) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  unMute: () => void;
  mute: () => void;
  destroy: () => void;
}

export const YouTubeEngine = forwardRef<YouTubeEngineRef, YouTubeEngineProps>(
  function YouTubeEngine({ videoId, onPlayStateChange, onProgressChange, onErrorFallback, onBufferingStateChange }, ref) {
    const playerRef = useRef<YTPlayerInterface | null>(null);
    const isReadyRef = useRef(false);
    const pendingCueRef = useRef<{ videoId: string; startSeconds: number } | null>(null);
    const isSnippetActiveRef = useRef(false);
    const stopTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const targetDurationRef = useRef<number>(0.5);
    const startSecondsRef = useRef<number>(0);
    const playbackStartPerfRef = useRef<number>(0);

    // Store callbacks in refs so they never cause re-renders or effect re-runs
    const onPlayStateChangeRef = useRef(onPlayStateChange);
    const onProgressChangeRef = useRef(onProgressChange);
    const onErrorFallbackRef = useRef(onErrorFallback);
    const onBufferingStateChangeRef = useRef(onBufferingStateChange);
    onPlayStateChangeRef.current = onPlayStateChange;
    onProgressChangeRef.current = onProgressChange;
    onErrorFallbackRef.current = onErrorFallback;
    onBufferingStateChangeRef.current = onBufferingStateChange;

    function clearTimers() {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    function finishSnippet() {
      if (!isSnippetActiveRef.current) return;
      isSnippetActiveRef.current = false;
      clearTimers();

      if (playerRef.current && isReadyRef.current) {
        try {
          playerRef.current.pauseVideo();
        } catch {
          // ignore
        }
      }

      onPlayStateChangeRef.current(false);
      // Keep progress at 100% when finished naturally
    }

    function startProgressTracking() {
      playbackStartPerfRef.current = performance.now();
      const durationMs = targetDurationRef.current * 1000;

      onPlayStateChangeRef.current(true);

      if (playerRef.current && isReadyRef.current) {
        try {
          playerRef.current.setVolume(100);
        } catch {
          // ignore
        }
      }

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        const elapsed = performance.now() - playbackStartPerfRef.current;
        const ratio = Math.min(1, elapsed / durationMs);
        onProgressChangeRef.current(ratio);

        if (elapsed >= durationMs) {
          finishSnippet();
        }
      }, 16);

      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        finishSnippet();
      }, durationMs + 50);
    }

    // Initialize YouTube player — only re-run when videoId changes
    useEffect(() => {
      let isMounted = true;

      // Load YouTube IFrame API script once
      if (!window.YT || !window.YT.Player) {
        const existing = document.getElementById('yt-iframe-api-script');
        if (!existing) {
          const tag = document.createElement('script');
          tag.id = 'yt-iframe-api-script';
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          } else {
            document.head.appendChild(tag);
          }
        }
      }

      const initPlayer = () => {
        if (!isMounted || !window.YT || !window.YT.Player) return;
        const elem = document.getElementById('youtube-player-frame');
        if (!elem) return;

        try {
          playerRef.current = new window.YT.Player('youtube-player-frame', {
            width: '280',
            height: '160',
            videoId: videoId || 'YdiKjg88WYk',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              playsinline: 1,
              enablejsapi: 1,
              origin: typeof window !== 'undefined' ? window.location.origin : undefined
            },
            events: {
              onReady: () => {
                if (isMounted) {
                  isReadyRef.current = true;
                  const pending = pendingCueRef.current;
                  if (pending && playerRef.current?.cueVideoById) {
                    try {
                      playerRef.current.cueVideoById(pending);
                      pendingCueRef.current = null;
                    } catch {}
                  }
                }
              },
              onStateChange: (event: { data: number }) => {
                if (!isMounted) return;
                
                if (event.data === 3) {
                  onBufferingStateChangeRef.current?.(true);
                } else if (event.data === 1 || event.data === 2 || event.data === 0) {
                  onBufferingStateChangeRef.current?.(false);
                }

                if (event.data === 2 || event.data === 0) {
                  isSnippetActiveRef.current = false;
                  clearTimers();
                  onPlayStateChangeRef.current(false);
                }

                if (event.data === 1) {
                  onPlayStateChangeRef.current(true);
                  if (isSnippetActiveRef.current && progressIntervalRef.current === null) {
                    startProgressTracking();
                  }
                }
              },
              onError: (event: { data: number }) => {
                console.error('YouTube player error:', event.data);
                if (isMounted) {
                  isSnippetActiveRef.current = false;
                  clearTimers();
                  onPlayStateChangeRef.current(false);
                  onProgressChangeRef.current(0);
                  onErrorFallbackRef.current?.();
                }
              }
            }
          });
        } catch {
          // setup error
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const prevCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prevCallback) prevCallback();
          initPlayer();
        };
      }

      return () => {
        isMounted = false;
        clearTimers();
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {
            // ignore
          }
          playerRef.current = null;
          isReadyRef.current = false;
        }
      };
    // Initialize exactly once
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        playSnippet: (duration: SnippetDuration, startSeconds = 0) => {
          // Stop any previous snippet
          isSnippetActiveRef.current = false;
          clearTimers();
          onProgressChangeRef.current(0);

          targetDurationRef.current = duration;
          startSecondsRef.current = startSeconds;

          if (playerRef.current && isReadyRef.current) {
            try {
              onBufferingStateChangeRef.current?.(true);
              
              const state = (playerRef.current as any).getPlayerState?.();
              
              playerRef.current.unMute();
              playerRef.current.setVolume(100);
              playerRef.current.seekTo(startSeconds, true);
              
              isSnippetActiveRef.current = true;
              
              if (state !== 1) {
                playerRef.current.playVideo();
              } else if (progressIntervalRef.current === null) {
                // If it was already playing, it will just seek and continue
                onBufferingStateChangeRef.current?.(false);
                startProgressTracking();
              }
            } catch {
              isSnippetActiveRef.current = false;
              onBufferingStateChangeRef.current?.(false);
              onErrorFallbackRef.current?.();
            }
          } else {
            onBufferingStateChangeRef.current?.(false);
            onErrorFallbackRef.current?.();
          }
        },
        playFull: (startSeconds = 0) => {
          isSnippetActiveRef.current = false;
          clearTimers();
          targetDurationRef.current = 999;
          startSecondsRef.current = startSeconds;

          if (playerRef.current && isReadyRef.current) {
            try {
              onBufferingStateChangeRef.current?.(true);
              
              const state = (playerRef.current as any).getPlayerState?.();
              
              playerRef.current.unMute();
              playerRef.current.setVolume(100);
              playerRef.current.seekTo(startSeconds, true);
              
              if (state !== 1) {
                playerRef.current.playVideo();
              }
              onPlayStateChangeRef.current(true);
            } catch {
              onBufferingStateChangeRef.current?.(false);
              onErrorFallbackRef.current?.();
            }
          }
        },
        stop: () => {
          isSnippetActiveRef.current = false;
          clearTimers();
          if (playerRef.current && isReadyRef.current) {
            try {
              playerRef.current.pauseVideo();
            } catch {
              // ignore
            }
          }
          onPlayStateChangeRef.current(false);
          onProgressChangeRef.current(0);
        },
        cueSong: (newVideoId: string, startSeconds = 0) => {
          startSecondsRef.current = startSeconds;
          if (playerRef.current && isReadyRef.current) {
            try {
              playerRef.current.cueVideoById({
                videoId: newVideoId,
                startSeconds
              });
            } catch {
              // ignore
            }
          } else {
            // Player not ready yet, store it so onReady can cue it
            pendingCueRef.current = { videoId: newVideoId, startSeconds };
          }
        }
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <div className="absolute -top-[9999px] -left-[9999px] w-0 h-0 opacity-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div id="youtube-player-frame" />
      </div>
    );
  }
);
