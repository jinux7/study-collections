import { Scene } from 'phaser';
import { insertSoundIcon, nextPageAddEvt } from './common';

export default class Load extends Scene {
  constructor() {
    super({
      key: 'stage1',
    });
  }
  preload() {
  }
  create() {
    this.add.image(375, 667, 'stage1-bg');
    this.insertPlaneImg();
    insertSoundIcon(this); // draw音乐icon
    nextPageAddEvt(this, 'stage2');
  }
  // 小飞机飞行动画
  insertPlaneImg() {
    var planeImg = this.add.image(1500, 1500, 'planeImg');
    planeImg.setAlpha(0);
    this.tweens.add({
      targets: planeImg,
      x:125,
      y: 150,
      scaleX: 1.0,
      scaleY: 1.0,
      alpha: 1.0,
      angle: 0,
      ease: 'Power3',
      duration: 1000, // duration of animation; higher=slower
      delay: 10      // wait 500 ms before starting
    });
  }
}