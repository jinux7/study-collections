import { Scene } from 'phaser';

var num = 0;
export default class PlayStage extends Scene {
  constructor() {
    super({
      key: 'playStage',
    });
  }

  
  preload() {
    
  }

  create() {
    this.input.addPointer(1); // 必须添加这个，才能是虚拟摇杆和按键同时响应事件 
    this.add.image(667, 375, 'playstage-bgImg'); // 添加背景图
    // 添加player
    this.player = this.physics.add.sprite(667, 375, 'dude');
    this.player.setCollideWorldBounds(true);
    // 添加虚拟手柄摇杆
    this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {
            x: 200,
            y: 375*2-150,
            radius: 100,
            // base: this.add.circle(0, 0, 100, 0x3c51be),
            // thumb: this.add.circle(0, 0, 50, 0x3d1a5f),
            base: this.add.image(0, 0, 'sticks', 'base'),
            thumb: this.add.image(0, 0, 'sticks', 'stick'),
            dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            forceMin: 16,
            // enable: true
        })
        .on('update', this.dumpJoyStickState, this);

    this.text = this.add.text(0, 0);
    this.dumpJoyStickState();
    // 添加虚拟手柄按键A,B,C
    let btn1up = this.add.sprite(667*2-370, 750-100, 'sticks', 'button1-up').setInteractive();
    let btn1down = this.add.sprite(667*2-370, 750-100, 'sticks', 'button1-down').setInteractive();
    let btn2up = this.add.sprite(667*2-250, 750-180, 'sticks', 'button2-up').setInteractive();
    let btn2down = this.add.sprite(667*2-250, 750-180, 'sticks', 'button2-down').setInteractive();
    let btn3up = this.add.sprite(667*2-100, 750-210, 'sticks', 'button3-up').setInteractive();
    let btn3down = this.add.sprite(667*2-100, 750-210, 'sticks', 'button3-down').setInteractive();
    // 先隐藏掉down的按键
    btn1down.setVisible(false);
    btn2down.setVisible(false);
    btn3down.setVisible(false);
    // 按键加点击事件
    btn1up.on('pointerdown', pointer=> {
      btn1up.setVisible(false);
      btn1down.setVisible(true);
      // do somethings
    });
    btn1down.on('pointerup', pointer=> {
      btn1up.setVisible(true);
      btn1down.setVisible(false);
      // do somethings
    });
    btn2up.on('pointerdown', pointer=> {
      btn2up.setVisible(false);
      btn2down.setVisible(true);
      // do somethings
    });
    btn2down.on('pointerup', pointer=> {
      btn2up.setVisible(true);
      btn2down.setVisible(false);
      // do somethings
    });
    btn3up.on('pointerdown', pointer=> {
      btn3up.setVisible(false);
      btn3down.setVisible(true);
      // do somethings
    });
    btn3down.on('pointerup', pointer=> {
      btn3up.setVisible(true);
      btn3down.setVisible(false);
      // do somethings
    });
    // player创建动画
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    
    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });
    
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 5,
      repeat: -1
    });
    this.player.anims.play('turn', true); // 初始化player处于turn动画状态
  }

  dumpJoyStickState() {
      var cursorKeys = this.joyStick.createCursorKeys();
      // var s = 'Key down: ';
      // for (var name in cursorKeys) {
      //     if (cursorKeys[name].isDown) {
      //         s += name + ' ';
      //     }
      // }
      // s += '\n';
      // s += ('Force: ' + Math.floor(this.joyStick.force * 100) / 100 + '\n');
      // s += ('Angle: ' + Math.floor(this.joyStick.angle * 100) / 100 + '\n');
      // this.text.setText(s);
      // 定义一个速度
      let v = 160;
      // 判断上下左右是否按下
      var leftKeyDown = this.joyStick.left;
      var rightKeyDown = this.joyStick.right;
      var upKeyDown = this.joyStick.up;
      var downKeyDown = this.joyStick.down;
      var noKeyDown = this.joyStick.noKey;
      if(leftKeyDown) {
        this.player.anims.play('left', true);
        this.player.setVelocityX(-v);
        this.player.setVelocityY(0);
      }else if(rightKeyDown) {
        this.player.anims.play('right', true);
        this.player.setVelocityX(v);
        this.player.setVelocityY(0);
      }else if(upKeyDown) {
        this.player.anims.play('turn', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(-v);
      }else if(downKeyDown) {
        this.player.anims.play('turn', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(v);
      }else if(noKeyDown) {
        this.player.anims.play('turn', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
      }
      // console.log(leftKeyDown, rightKeyDown, upKeyDown, downKeyDown, noKeyDown);
  }
}
