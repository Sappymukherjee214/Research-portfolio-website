"use client";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private isEnabled = false;
  private ambientOscs: OscillatorNode[] = [];

  constructor() {
    // We don't initialize here to avoid SSR issues and wait for user interaction
  }

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5; // Increased global volume
    this.isEnabled = true;
  }

  public enable() {
    this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    // Play a very subtle startup click to confirm
    this.playTone(1000, 'sine', 0.01, 0.1);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainValue: number = 1) {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    g.gain.setValueAtTime(gainValue, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);

    osc.connect(g);
    g.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playHover() {
    this.playTone(800, 'sine', 0.05, 0.8);
  }

  public playClick() {
    this.playTone(400, 'sine', 0.1, 1.0);
  }

  public playTerminal() {
    // Noise-based clack
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;
    
    const bufferSize = this.ctx.sampleRate * 0.02;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000 + Math.random() * 500;
    filter.Q.value = 1;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.4, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.02);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);

    noise.start();
  }

  public playSuccess() {
    this.playTone(523.25, 'sine', 0.5, 0.3); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.5, 0.3), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.5, 0.3), 200); // G5
  }

  public playStatic(intensity: number) {
    if (!this.isEnabled || !this.ctx || !this.masterGain || intensity === 0) return;
    
    const duration = 0.1;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (intensity / 10);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);

    noise.connect(g);
    g.connect(this.masterGain);
    noise.start();
  }

  public startAmbient() {
    if (!this.isEnabled || !this.ctx || !this.masterGain || this.ambientOscs.length > 0) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 2); // Very audible ambient
    this.ambientGain.connect(this.masterGain);

    const freqs = [110, 110.5, 164.81, 220]; // A2, slightly detuned A2, E3, A3
    freqs.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      osc.connect(this.ambientGain!);
      osc.start();
      this.ambientOscs.push(osc);
    });

    // LFO to create "breathing" effect
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 0.1Hz
    lfoGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientGain.gain);
    lfo.start();
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        this.ambientOscs.forEach(o => o.stop());
        this.ambientOscs = [];
        this.ambientGain = null;
      }, 1000);
    }
  }

  public setMasterVolume(v: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.1);
    }
  }
}

export const audioManager = typeof window !== 'undefined' ? new AudioManager() : null;
