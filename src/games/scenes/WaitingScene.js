export function createWaitingScene(Phaser) {
  class WaitingScene extends Phaser.Scene {
    constructor() {
      super('WaitingScene');
    }

    create() {
      const { width, height } = this.scale;

      this.cameras.main.setBackgroundColor('#09090B');

      this.add
        .rectangle(width / 2, height / 2, width, height, 0x111113)
        .setAlpha(0.95);

      const glow = this.add.circle(width / 2, height * 0.38, 70, 0x7c3aed, 0.2);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.15, to: 0.35 },
        scale: { from: 0.9, to: 1.1 },
        duration: 1600,
        yoyo: true,
        repeat: -1,
      });

      this.add
        .text(width / 2, height * 0.38, 'PV', {
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '42px',
          color: '#FAFAFA',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      this.add
        .text(width / 2, height * 0.55, 'Engine Ready', {
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '28px',
          color: '#FAFAFA',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      this.add
        .text(
          width / 2,
          height * 0.64,
          'No game module registered for this title yet.\nThe PlayVerse runtime is online and waiting.',
          {
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '16px',
            color: '#A1A1AA',
            align: 'center',
            lineSpacing: 8,
          },
        )
        .setOrigin(0.5);

      this.add
        .text(width / 2, height * 0.82, 'Register games via GameRegistry', {
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '13px',
          color: '#71717A',
        })
        .setOrigin(0.5);
    }
  }

  return WaitingScene;
}
