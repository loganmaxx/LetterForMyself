// Pure Web Audio API multi-channel Ambient Soundscape & Chime Engine

export type SoundChannel = 'rain' | 'forest' | 'hearth';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: Partial<Record<SoundChannel, { stop: () => void; setVolume: (v: number) => void }>> = {};
  private volumes: Record<SoundChannel, number> = {
    rain: 0.35,
    forest: 0.3,
    hearth: 0.35,
  };
  private enabled: Record<SoundChannel, boolean> = {
    rain: false,
    forest: false,
    hearth: false,
  };

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isChannelActive(channel: SoundChannel): boolean {
    return this.enabled[channel];
  }

  public isAnyPlaying(): boolean {
    return this.enabled.rain || this.enabled.forest || this.enabled.hearth;
  }

  public getVolume(channel: SoundChannel): number {
    return this.volumes[channel];
  }

  public setVolume(channel: SoundChannel, val: number): void {
    this.volumes[channel] = Math.max(0, Math.min(1, val));
    if (this.activeNodes[channel]) {
      this.activeNodes[channel]!.setVolume(this.volumes[channel]);
    }
  }

  public toggleChannel(channel: SoundChannel): boolean {
    if (this.enabled[channel]) {
      this.stopChannel(channel);
      return false;
    } else {
      this.startChannel(channel);
      return true;
    }
  }

  public stopAll(): void {
    (['rain', 'forest', 'hearth'] as SoundChannel[]).forEach((ch) => this.stopChannel(ch));
  }

  public stopChannel(channel: SoundChannel): void {
    this.enabled[channel] = false;
    if (this.activeNodes[channel]) {
      this.activeNodes[channel]!.stop();
      delete this.activeNodes[channel];
    }
  }

  public startChannel(channel: SoundChannel): void {
    this.stopChannel(channel);
    const ctx = this.getContext();
    this.enabled[channel] = true;

    if (channel === 'rain') {
      // Pink noise filtered to sound like gentle rain on leaves
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1150;

      const gainNode = ctx.createGain();
      gainNode.gain.value = this.volumes.rain * 0.65;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start(0);

      this.activeNodes.rain = {
        stop: () => {
          try {
            whiteNoise.stop();
            whiteNoise.disconnect();
          } catch {}
        },
        setVolume: (v: number) => {
          gainNode.gain.setTargetAtTime(v * 0.65, ctx.currentTime, 0.1);
        },
      };
    } else if (channel === 'forest') {
      // Soft modulated breeze through trees
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.12;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 420;
      filter.Q.value = 2.5;

      // Slow LFO modulating breeze swell
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.16; // every ~6 seconds
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 180;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const gainNode = ctx.createGain();
      gainNode.gain.value = this.volumes.forest * 0.5;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      lfo.start(0);

      this.activeNodes.forest = {
        stop: () => {
          try {
            source.stop();
            lfo.stop();
            source.disconnect();
          } catch {}
        },
        setVolume: (v: number) => {
          gainNode.gain.setTargetAtTime(v * 0.5, ctx.currentTime, 0.1);
        },
      };
    } else if (channel === 'hearth') {
      // Warm low hearth rumble + soft crackle pops
      const bufferSize = 3 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise base
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.25;
        // Occasional gentle fireplace crackle pop
        if (Math.random() < 0.0012) {
          output[i] += (Math.random() * 2 - 1) * 0.45;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;

      const gainNode = ctx.createGain();
      gainNode.gain.value = this.volumes.hearth * 0.7;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);

      this.activeNodes.hearth = {
        stop: () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        },
        setVolume: (v: number) => {
          gainNode.gain.setTargetAtTime(v * 0.7, ctx.currentTime, 0.1);
        },
      };
    }
  }

  // Play a warm harmonic singing bowl chime (default 432Hz or 528Hz)
  public playSingingBowl(baseFreq = 432): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const harmonics = [1, 2.756, 5.404];
      const gains = [0.22, 0.08, 0.03];
      const durations = [4.2, 2.6, 1.5];

      harmonics.forEach((ratio, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durations[idx]);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + durations[idx]);
      });
    } catch {
      // Ignore if audio context not allowed yet
    }
  }
}

export const AudioEngine = new AmbientAudioEngine();
