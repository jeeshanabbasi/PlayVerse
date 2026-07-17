export class AudioSynthController {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Play a short retro pitch bend up sound on eating food.
   */
  playEat() {
    const sound = this.scene.sound;
    if (sound.mute) return;
    const ctx = sound.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);

    gain.gain.setValueAtTime(vol * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.12);
  }

  /**
   * Play a sad descending retro sweep on game over.
   */
  playGameOver() {
    const sound = this.scene.sound;
    if (sound.mute) return;
    const ctx = sound.context;
    if (!ctx) return;

    const vol = sound.volume ?? 0.8;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.6);

    gain.gain.setValueAtTime(vol * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.6);
  }
}
