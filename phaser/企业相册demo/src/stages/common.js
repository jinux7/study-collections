export const insertSoundIcon = sence=> {
  let bgm = sence.game.sound.get('bgm'); // bgm音乐对象
  let soundOpen = sence.add.sprite(750-50, 100, 'sound-open').setInteractive();
  let soundClose = sence.add.sprite(750-50, 100, 'sound-close').setInteractive();
  soundClose.setVisible(false);
  soundOpen.on('pointerdown', pointer=> {
    soundOpen.setVisible(false);
    soundClose.setVisible(true);
    bgm.pause();
  });
  soundClose.on('pointerdown', pointer=> {
    soundOpen.setVisible(true);
    soundClose.setVisible(false);
    bgm.resume();
  });
}
export const nextPageAddEvt = (scene, nextStageName)=> {
  let pointerDistance = {
    startY: 0,
    endY: 0,
    computed: 0
  }
  // scene添加事件
  scene.input.on('pointerdown', function(pointer) {
    pointerDistance.startY = pointer.y;
  });

  scene.input.on('pointerup', function(pointer) {
    pointerDistance.endY = pointer.y;
    pointerDistance.computed = pointerDistance.endY - pointerDistance.startY;
    if(pointerDistance.computed < -200) {
      scene.scene.start(nextStageName);
      pointerDistance = {
        startY: 0,
        endY: 0,
        computed: 0
      }
    }
  });
}
export const prePageAddEvt = (scene, preStageName)=> {
  let pointerDistance = {
    startY: 0,
    endY: 0,
    computed: 0
  }
  // scene添加事件
  scene.input.on('pointerdown', function(pointer) {
    pointerDistance.startY = pointer.y;
  });

  scene.input.on('pointerup', function(pointer) {
    pointerDistance.endY = pointer.y;
    pointerDistance.computed = pointerDistance.endY - pointerDistance.startY;
    if(pointerDistance.computed > 200) {
      scene.scene.start(preStageName);
      console.log(scene.scene, 998);
      pointerDistance = {
        startY: 0,
        endY: 0,
        computed: 0
      }
    }
  });
}
export default {
  insertSoundIcon,
  nextPageAddEvt,
  prePageAddEvt
}