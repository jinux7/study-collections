import Phaser from 'phaser';
import Load from './stages/load';
import Stage1 from './stages/stage-1';
import Stage2 from './stages/stage-2';
import Stage3 from './stages/stage-3';

window.addEventListener('load', ()=> {
  var gameConfig = {
    type: Phaser.AUTO,
    width: 375*2,
    height: 667*2,
    backgroundColor: '#ffffff',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 }
      }
    },
    scene: [Load, Stage1, Stage2, Stage3]
  }
  const game = new Phaser.Game(gameConfig);
});
