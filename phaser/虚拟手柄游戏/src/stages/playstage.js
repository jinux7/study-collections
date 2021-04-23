import { Scene } from 'phaser';

var count = 0;
var score = 0;
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
    // 添加coin
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 10,
      setXY: { x:0, y: 0 }
    });
    // 添加bomb
    this.bombs = this.physics.add.group();
    // 添加player
    this.player = this.physics.add.sprite(667, 375, 'dude');
    this.player.setCollideWorldBounds(true);
    // 添加小星星
    this.star = this.add.sprite(100, 100, 'star');
    this.star.setVisible(false); // 隐藏小星星
    // 添加文本
    this.text = this.add.text(0, 0, '', { fontSize: '32px', fill: '#ffffff' });
    // player与coin进行碰撞检测 
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    // player与bomb进行碰撞检测
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
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
            // forceMin: 16,
            // enable: true
        })
        .on('update', this.dumpJoyStickState, this);

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

    // coin创建动画
    this.anims.create({
      key: 'coin-rotate',
      frames: this.anims.generateFrameNumbers('coin'),
      frameRate: 20,
      repeat: -1
    });
    this.player.anims.play('turn', true); // 初始化player处于turn动画状态
    // coins处理
    this.coins.children.iterate(function (child) {
      child.anims.play('coin-rotate', true);
      child.setX(Phaser.Math.Between(50, 667*2-50));
      child.setY(Phaser.Math.Between(50, 750-50));
    });
  }

  dumpJoyStickState() {
      var cursorKeys = this.joyStick.createCursorKeys();
      // this.joyStick.force
      // this.joyStick.angle
      let forceVal = this.joyStick.force;
      // 定义一个速度
      let v = 2;
      // 判断上下左右是否按下
      var leftKeyDown = this.joyStick.left;
      var rightKeyDown = this.joyStick.right;
      var upKeyDown = this.joyStick.up;
      var downKeyDown = this.joyStick.down;
      var noKeyDown = this.joyStick.noKey;
      if(leftKeyDown&&!upKeyDown&&!downKeyDown) { // 左
        this.player.anims.play('left', true);
        this.player.setVelocityX(-this.getForceVal(forceVal)*v);
        this.player.setVelocityY(0);
      }else if(rightKeyDown&&!upKeyDown&&!downKeyDown) { // 右
        this.player.anims.play('right', true);
        this.player.setVelocityX(this.getForceVal(forceVal)*v);
        this.player.setVelocityY(0);
      }else if(upKeyDown&&!leftKeyDown&&!rightKeyDown) { // 上
        this.player.anims.play('turn', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(-this.getForceVal(forceVal)*v);
      }else if(downKeyDown&&!leftKeyDown&&!rightKeyDown) { // 下
        this.player.anims.play('turn', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(this.getForceVal(forceVal)*v);
      }else if(leftKeyDown&&upKeyDown) { // 左上
        this.player.anims.play('left', true);
        this.player.setVelocityX(-this.getForceVal(forceVal)*v);
        this.player.setVelocityY(-this.getForceVal(forceVal)*v);
      }else if(rightKeyDown&&upKeyDown) { // 右上
        this.player.anims.play('right', true);
        this.player.setVelocityX(this.getForceVal(forceVal)*v);
        this.player.setVelocityY(-this.getForceVal(forceVal)*v);
      }else if(leftKeyDown&&downKeyDown) { // 左下
        this.player.anims.play('left', true);
        this.player.setVelocityX(-this.getForceVal(forceVal)*v);
        this.player.setVelocityY(this.getForceVal(forceVal)*v);
      }else if(rightKeyDown&&downKeyDown) { // 右下
        this.player.anims.play('right', true);
        this.player.setVelocityX(this.getForceVal(forceVal)*v);
        this.player.setVelocityY(this.getForceVal(forceVal)*v);
      }else if(noKeyDown) {
        this.player.anims.play('turn', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
      }
      // console.log(leftKeyDown, rightKeyDown, upKeyDown, downKeyDown, noKeyDown);
  }

  // 设置最大force值
  getForceVal(forceVal) {
    return forceVal>100 ? 100 : forceVal;
  }
  // player与coin碰撞后回调
  collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    this.text.setText('Score: ' + score);
    this.starTween(coin);
    if(this.coins.countActive(true) === 0) {
      this.coins.children.iterate(function (child) {
        child.enableBody(true, Phaser.Math.Between(50, 667*2-50), Phaser.Math.Between(50, 750-50), true, true);
      });
      var x = (player.x < 667) ? Phaser.Math.Between(667, 667*2) : Phaser.Math.Between(0, 667);
      var bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 100);

    }
  }
  // 小星星动画
  starTween(coin) {
    this.star.setVisible(true);
    this.star.setX(coin.x);
    this.star.setY(coin.y);
    this.tweens.add({
      targets: this.star,
      // x: coin.x,
      // y: coin.y,
      scaleX: 3.0,
      scaleY: 3.0,
      alpha: 1.0,
      angle: 0,
      ease: 'Power3',
      duration: 100, // duration of animation; higher=slower
      delay: 0,      // wait 500 ms before starting
      onComplete: ()=> { // 动画执行完回调函数
        this.star.setVisible(false);
      }
    });
  }
  // player与bomb碰撞后回调
  hitBomb() {
    this.physics.pause();
  }
}
