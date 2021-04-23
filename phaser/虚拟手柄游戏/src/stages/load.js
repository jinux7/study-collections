import { Scene } from 'phaser';
import bgImg from '../assets/bg.jpg';
import logoImg from '../assets/logo.png';
import processbarWrapImg from '../assets/processbar-wrap.png';
import processbarInnerImg from '../assets/processbar-inner.png';
import startBtn from '../assets/startBtn.png';
import playstageBgImg from '../assets/play-stage-bg.jpg';
import stickImg from '../assets/arcade-joystick.png';
import stickJson from '../assets/arcade-joystick.json';
import dudeImg from '../assets/dude.png';
import coinImg from '../assets/coin.png';
import starImg from '../assets/star.png';
import bombImg from '../assets/bomb.png';

export default class Load extends Scene {
  constructor() {
    super({
      key: 'load',
			pack: { // 此处加载好图片后在执行preload钩子函数
				files: [
					{ type: 'image', key: 'bgImg', url: bgImg },
					{ type: 'image', key: 'logoImg', url: logoImg },
					{ type: 'image', key: 'processbar-wrap', url: processbarWrapImg },
					{ type: 'image', key: 'processbar-inner', url: processbarInnerImg },
					{ type: 'image', key: 'startBtn', url: startBtn }

				]
			}
    });
  }
  preload() {
    // load playstage的资源
    this.load.image('playstage-bgImg', playstageBgImg);
    this.load.atlas('sticks', stickImg, stickJson);
    this.load.spritesheet('dude', dudeImg, { frameWidth: 32*2, frameHeight: 48*2 });
    this.load.spritesheet('coin', coinImg, { frameWidth: 50, frameHeight: 50 });
    this.load.image('star', starImg);
    this.load.image('bomb', bombImg);
    // 当前stage的元素
    this.add.image(667, 375, 'bgImg');
    this.logoAni();
    this.insertText();
    let startBtnImg = this.add.sprite(667, 375*2-200, 'startBtn').setInteractive();
    startBtnImg.setVisible(false);
    this.add.image(667, 375*2-50, 'processbar-wrap');
    let processbarInnerSprite = this.add.sprite(667, 375*2-50, 'processbar-inner');
    let processbarInnerSpriteWidth = processbarInnerSprite.width;
    startBtnImg.on('pointerdown', pointer=> {
      startBtnImg.setAlpha(0.5);
    });
    startBtnImg.on('pointerup', pointer=> {
      startBtnImg.setAlpha(1);
      setTimeout(() => {
        this.scene.start('playStage');
      }, 150);
    });
    // load所有资源
    // load进度监听
		this.load.on('progress', (val)=> {
			var w = Math.floor(processbarInnerSpriteWidth * val);
      processbarInnerSprite.setCrop(0, 0, w, 100);
      if(val === 1) {
        startBtnImg.setVisible(true);
      }
    }, this);
  }
  create() {
    this.scene.start('playStage'); // 调试，直接跳转到此stage
  }
  insertText() {
    // 文字
    var text = this.add.text(667, 375*2-100, "王者荣耀\n让我们一起play", {fontFamily: '微软雅黑', fill: "#ffffff", fontSize: "24px"});
		text.setOrigin(0.5);
    text.setAlign('center');
  }
  logoAni() {
    var logoImg = this.add.image(667, 260, 'logoImg');
    logoImg.setAlpha(0);
    logoImg.setScale(0.5);
    this.tweens.add({
      targets: logoImg,
      // x:125,
      // y: 150,
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