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
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 1.0,
      angle: 0,
      ease: 'Power3',
      duration: 3000, // duration of animation; higher=slower
      delay: 0,      // wait 500 ms before starting
      onComplete: ()=> { // 动画执行完回调函数
        this.insertText1();
      }
    });
  }
  // 文字效果
  insertText1() {
    var text = this.add.text(375, 667*3, "欢迎欣赏场景3", {fontFamily: '微软雅黑', fill: "red", fontSize: "50px"});
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
      onComplete: ()=> { // 动画执行完回调函数
        this.insertText2();
      }
    });
  }
  insertText2() {
    var text = this.add.text(375, -200, "欢迎欣赏场景3", {fontFamily: '微软雅黑', fill: "red", fontSize: "70px"});
		text.setOrigin(0.5);
    text.setAlpha(0);
    this.tweens.add({
      targets: text,
      x:375,
      y: 550,
      scaleX: 1,
      scaleY: 1,
      alpha: 1.0,
      angle: 0,
      ease: 'Power3',
      duration: 1000, // duration of animation; higher=slower
      delay: 0,      // wait 500 ms before starting
    });
  }
}