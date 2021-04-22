import Phaser from 'phaser';
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import Load from './stages/load';
import PlayStage from './stages/playstage';

window.addEventListener('load', ()=> {
  var gameConfig = {
    type: Phaser.AUTO,
    width: 667*2,
    height: 375*2,
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
    plugins: {
      global: [{
          key: 'rexVirtualJoyStick',
          plugin: VirtualJoyStickPlugin,
          start: true
      }]
    },
    scene: [PlayStage, Load]
  }
  const game = new Phaser.Game(gameConfig);
});
