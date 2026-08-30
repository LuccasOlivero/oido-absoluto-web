import { SnippetDuration, Song } from '@/types';

// ============================================================================
// 1. Sound Effects Engine (Web Audio API Synthesizer)
// ============================================================================

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public playExact() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 Fanfare
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.36);
      });
    } catch {
      // safe fallback
    }
  }

  public playClose() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const notes = [587.33, 880]; // D5, A5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.26);
      });
    } catch {
      // safe fallback
    }
  }

  public playLifeLost() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } catch {
      // safe fallback
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // safe fallback
    }
  }

  public playUnlock() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // safe fallback
    }
  }
}

export const sfx = new SoundEffectsEngine();

// ============================================================================
// 2. High-Performance Snippet Audio Player (Always restarts from 0:00)
// ============================================================================

export class SnippetAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private playPromise: Promise<void> | null = null;
  private isPlaying = false;
  private stopTimer: NodeJS.Timeout | null = null;
  private progressInterval: NodeJS.Timeout | null = null;
  private onPlayStateChange: ((isPlaying: boolean) => void) | null = null;
  private onProgressChange: ((progress: number) => void) | null = null;
  private currentUrl: string | null = null;
  private lastStartTime = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audio = new Audio();
        this.audio.preload = 'auto';

        this.audio.addEventListener('ended', () => this.handleStop());
        this.audio.addEventListener('pause', () => this.handleStop());
        this.audio.addEventListener('error', () => this.handleStop());
      } catch {
        // audio init safe catch
      }
    }
  }

  public setCallbacks(
    onPlayState: (isPlaying: boolean) => void,
    onProgress: (progress: number) => void
  ) {
    this.onPlayStateChange = onPlayState;
    this.onProgressChange = onProgress;
  }

  public loadSong(songOrUrl: Song | string) {
    this.stop();
    const url = typeof songOrUrl === 'string' ? songOrUrl : songOrUrl.audio_url;

    if (!this.audio || !url || this.currentUrl === url) return;
    this.currentUrl = url;

    try {
      this.audio.src = url;
      this.audio.load();
    } catch {
      // safe catch
    }
  }

  private clearTimers() {
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  public playSnippet(duration: SnippetDuration, startTime = 0) {
    if (!this.audio) return;
    this.clearTimers();
    this.lastStartTime = startTime;

    const startPlay = () => {
      if (!this.audio) return;
      try {
        // Pause first & ALWAYS rewind to the start of the snippet (time 0 or preview_start)
        this.audio.pause();
        this.audio.currentTime = startTime;
      } catch {
        // ignore seek error
      }

      this.isPlaying = true;
      this.onPlayStateChange?.(true);

      const startTimestamp = Date.now();
      const durationMs = duration * 1000;

      this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTimestamp;
        const ratio = Math.min(1, elapsed / durationMs);
        this.onProgressChange?.(ratio);
        if (ratio >= 1) {
          this.clearTimers();
          this.stop();
        }
      }, 20);

      this.stopTimer = setTimeout(() => {
        this.stop();
      }, durationMs);

      try {
        this.playPromise = this.audio.play();
        if (this.playPromise !== undefined) {
          this.playPromise
            .catch(() => {
              this.handleStop();
            })
            .finally(() => {
              this.playPromise = null;
            });
        }
      } catch {
        this.handleStop();
      }
    };

    if (this.playPromise) {
      this.playPromise.then(() => startPlay()).catch(() => startPlay());
    } else {
      startPlay();
    }
  }

  public playFullSong(startTime = 0) {
    if (!this.audio) return;
    this.clearTimers();

    const startFull = () => {
      if (!this.audio) return;
      try {
        this.audio.currentTime = startTime;
      } catch {
        // ignore
      }
      this.isPlaying = true;
      this.onPlayStateChange?.(true);

      try {
        this.playPromise = this.audio.play();
        if (this.playPromise !== undefined) {
          this.playPromise
            .catch(() => {
              this.handleStop();
            })
            .finally(() => {
              this.playPromise = null;
            });
        }
      } catch {
        this.handleStop();
      }
    };

    if (this.playPromise) {
      this.playPromise.then(() => startFull()).catch(() => startFull());
    } else {
      startFull();
    }
  }

  public stop() {
    this.clearTimers();
    if (!this.audio) return;

    const doPause = () => {
      if (!this.audio) return;
      try {
        this.audio.pause();
        // Rewind back to the start offset
        this.audio.currentTime = this.lastStartTime;
      } catch {
        // ignore pause error
      }
      this.handleStop();
    };

    if (this.playPromise) {
      this.playPromise.then(() => doPause()).catch(() => doPause());
    } else {
      doPause();
    }
  }

  private handleStop() {
    this.isPlaying = false;
    this.onPlayStateChange?.(false);
    this.onProgressChange?.(0);
  }

  public destroy() {
    this.stop();
    if (this.audio) {
      try {
        this.audio.src = '';
      } catch {
        // ignore
      }
      this.audio = null;
    }
  }
}

// Export UniversalAudioPlayer alias for backwards-compatibility
export { SnippetAudioPlayer as UniversalAudioPlayer };
