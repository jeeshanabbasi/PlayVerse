export class AudioSynthController {
  constructor(scene) {
    this.scene = scene;
  }

  playClick() {
    const sound = this.scene.sound;
    if (sound?.mute) return;
    const ctx = sound?.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    gain.gain.setValueAtTime(vol * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.05);
  }

  playMove() {
    const sound = this.scene.sound;
    if (sound?.mute) return;
    const ctx = sound?.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);

    gain.gain.setValueAtTime(vol * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.08);
  }

  playWin() {
    const sound = this.scene.sound;
    if (sound?.mute) return;
    const ctx = sound?.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;

    const playNote = (freq, startOffset, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(vol * 0.12, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration);
    };

    playNote(330, 0, 0.12);
    playNote(440, 0.08, 0.12);
    playNote(550, 0.16, 0.12);
    playNote(660, 0.24, 0.3);
  }

  playDraw() {
    const sound = this.scene.sound;
    if (sound?.mute) return;
    const ctx = sound?.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(240, now + 0.12);
    osc.frequency.linearRampToValueAtTime(220, now + 0.25);

    gain.gain.setValueAtTime(vol * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.25);
  }

  playLose() {
    const sound = this.scene.sound;
    if (sound?.mute) return;
    const ctx = sound?.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.6);

    gain.gain.setValueAtTime(vol * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.6);
  }
}
