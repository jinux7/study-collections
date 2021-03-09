import { Scene } from 'phaser';
import bgImg from '../assets/bg.png';
import logoImg from '../assets/logo.png';
import stage1BgImg from '../assets/stage1-bg.png';
import stage2BgImg from '../assets/stage2-bg.png';
import stage3BgImg from '../assets/stage3-bg.png';
import processbarWrapImg from '../assets/processbar-wrap.png';
import processbarInnerImg from '../assets/processbar-inner.png';
import planeImg from '../assets/plane.png';
import soundOpenImg from '../assets/sound-open.png';
import soundCloseImg from '../assets/sound-close.png';
import bgm from '../assets/bgm.mp3';

export default class Load extends Scene {
  constructor() {
    super({
      key: 'load',
			pack: { // 此处加载好图片后在执行create钩子函数
				files: [
					{ type: 'image', key: 'bgImg', url: bgImg },
					{ type: 'image', key: 'logoImg', url: logoImg },
					{ type: 'image', key: 'processbar-wrap', url: processbarWrapImg },
					{ type: 'image', key: 'processbar-inner', url: processbarInnerImg },
					// { type: 'audio', key: 'bgm', url: [ bgm ] },
				]
			}
    });
  }
  preload() {
    // 开始load页面，将html里的loading去掉
    if(document.getElementById('loading')) document.body.removeChild(document.getElementById('loading'));
    // 当前stage的元素画好
    this.add.image(375, 667, 'bgImg');
    this.add.image(375, 100, 'logoImg');
    this.add.image(375, 667*2-120, 'processbar-wrap');
    let processbarInnerSprite = this.add.sprite(375, 667*2-120, 'processbar-inner');
    let processbarInnerSpriteWidth = processbarInnerSprite.width;
    // 文字
    var text = this.add.text(375, 667*2-50, "企业宣传\n企业相册展示", {fontFamily: '微软雅黑', fill: "#000", fontSize: "20px"});
		text.setOrigin(0.5);
    text.setAlign('center');

    // load所有资源
    this.load.audio('bgm', [ bgm ]);
    this.load.image('stage1-bg', stage1BgImg);
    this.load.image('stage2-bg', stage2BgImg);
    this.load.image('stage3-bg', stage3BgImg);
    this.load.image('planeImg', planeImg);
    this.load.image('sound-open', soundOpenImg);
    this.load.image('sound-close', soundCloseImg);

    // load进度监听
		this.load.on('progress', (val)=> {
			var w = Math.floor(processbarInnerSpriteWidth * val);
      processbarInnerSprite.setCrop(0, 0, w, 100);
      if(val === 1) {
        
      }
    }, this);
  }
  create() {
    setTimeout(()=> {
      this.scene.start('stage1');
      let bgm = this.sound.add('bgm');
      bgm.play();
    }, 1000);
  }
}