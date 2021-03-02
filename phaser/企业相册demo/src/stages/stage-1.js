import { Scene } from 'phaser';
import { insertSoundIcon, nextPageAddEvt } from './common';

export default class Load extends Scene {
  constructor() {
    super({
      key: 'stage1',
    });
  }
  init() {
    console.log();
  }
  preload() {
    console.log();
  }
  create() {
    this.add.image(375, 667, 'stage1-bg');
    insertSoundIcon(this); // draw音乐icon
    nextPageAddEvt(this, 'stage2');
    if(!this.myStore) {
      this.insertPlaneImg();
      this.myStore = true;
    }else {
      this.reSee();
    }
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
      delay: 10,      // wait 500 ms before starting
      onComplete: ()=> { // 动画执行完回调函数
        this.insertText();
      }
    });
  }
  // 文字效果
  insertText() {
    var text = this.add.text(375, 667, "欢迎欣赏场景1", {fontFamily: '微软雅黑', fill: "red", fontSize: "150px"});
		text.setOrigin(0.5);
    text.setAlpha(0);
    this.tweens.add({
      targets: text,
      x:375,
      y: 350,
      scaleX: 0.5,
      scaleY: 0.5,
      alpha: 1.0,
      angle: -360,
      ease: 'Power3',
      duration: 2000, // duration of animation; higher=slower
      delay: 0,      // wait 500 ms before starting
    });
  }
  reSee() {
    // 小飞机
    var planeImg = this.add.image(1500, 1500, 'planeImg');
    planeImg.setX(125).setY(150);
    // 文字
    var text = this.add.text(375, 350, "欢迎欣赏场景1", {fontFamily: '微软雅黑', fill: "red", fontSize: "150px"});
		text.setOrigin(0.5);
    text.setScale(0.5);
  }
}