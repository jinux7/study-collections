import { Scene } from 'phaser';
import { insertSoundIcon, nextPageAddEvt, prePageAddEvt } from './common';

export default class Load extends Scene {
  constructor() {
    super({
      key: 'stage3',
    });
  }
  preload() {
  }
  create() {
    this.add.image(375, 667, 'stage3-bg');
    this.insertPlaneImg();
    insertSoundIcon(this); // draw音乐icon
    nextPageAddEvt(this, 'stage1'); // 下一页
    prePageAddEvt(this, 'stage2'); // 上一页
  }
  // 小飞机飞行动画
  insertPlaneImg() {
    var planeImg = this.add.image(1500, 1500, 'planeImg');
    planeImg.setAngle(-180);
		planeImg.setScale(0, 0);
    planeImg.setAlpha(0.5);
    this.tweens.add({
      targets: planeImg,
      x:125,
      y: 150,
      scaleX: 2.0,
      scaleY: 2.0,
      alpha: 1.0,
      angle: 0,
      ease: 'Power3',
      duration: 3000, // duration of animation; higher=slower
      delay: 0      // wait 500 ms before starting
    });
  }
}