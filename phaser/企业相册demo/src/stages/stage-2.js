import { Scene } from 'phaser';
import { insertSoundIcon, nextPageAddEvt, prePageAddEvt } from './common';

export default class Load extends Scene {
  constructor() {
    super({
      key: 'stage2',
    });
  }
  preload() {
  }
  create() {
    this.add.image(375, 667, 'stage2-bg');
    this.insertPlaneImg();
    this.insertText();
    insertSoundIcon(this); // draw音乐icon
    nextPageAddEvt(this, 'stage3'); // 下一页
    prePageAddEvt(this, 'stage1'); // 上一页
  }
  // 小飞机飞行动画
  insertPlaneImg() {
    var planeImg = this.add.image(1500, 1500, 'planeImg');
    planeImg.setAngle(180);
		planeImg.setScale(4.0, 4.0);
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
      duration: 5000, // duration of animation; higher=slower
      delay: 0,      // wait 500 ms before starting
      onComplete: ()=> { // 动画执行完回调函数
      }
    });
  }
  // 文字效果
  insertText() {
    var text = this.add.text(375, 667*3, "欢迎欣赏场景2", {fontFamily: '微软雅黑', fill: "red", fontSize: "100px"});
		text.setOrigin(0.5);
    text.setAlpha(0);
    this.tweens.add({
      targets: text,
      x:375,
      y: 350,
      scaleX: 1,
      scaleY: 1,
      alpha: 1.0,
      angle: 0,
      ease: 'Power3',
      duration: 2000, // duration of animation; higher=slower
      delay: 0,      // wait 500 ms before starting
    });
  }
}