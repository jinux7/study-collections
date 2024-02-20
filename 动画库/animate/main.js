import animate, { Linear, QuadraticIn, QuinticIn } from "./animate";
// 使用方法
// 获取时间线的实例
let tl = animate();
// 向时间线中加入动画实例
tl.add({
  el: '#el1', // 动画元素，可以是string或dom元素
  property: 'transform', // 动画的属性
  startValue: 0, // 动画初始值
  endValue: 500, // 动画的结束值
  duration: 2, // 动画持续时间 秒单位
  delay: 0, // 动画的延迟 秒单位
  timingFunction: QuadraticIn, // 动画的移动效果，可以查看Easing.js文件
  template: v=> `translate(${v}px)`, // 动画执行的每一帧，返给属性加工后得知，比如返回“500px”等
  startTime: new Date('2024-2-20 9:36:00'), // 可以指定具体的时间让动画执行
  loop: 'reverse', // 动画是否循环 loop值真时正常动画 reverse反向动画
});
// 下面是对同一个元素el2的两个属性添加动画效果
tl.add({
  el: '#el2',
  property: 'top', 
  startValue: 0, 
  endValue: 500, 
  duration: 2, 
  delay: 0, 
  timingFunction: Linear, 
  template: v=> `${v}px`,
  loop: true
});
tl.add({
  el: '#el2',
  property: 'left', 
  startValue: 0, 
  endValue: 500, 
  duration: 2, 
  delay: 0, 
  timingFunction: Linear, 
  template: v=> `${v}px`,
  loop: true
});

// 按钮事件
document.querySelector('#startBtn').addEventListener('click', ev=> {
  tl.start();
}, false);
// document.querySelector('#resetBtn').addEventListener('click', ev=> {
//   tl.reset();
// }, false);
document.querySelector('#pauseBtn').addEventListener('click', ev=> {
  tl.pause();
}, false);
document.querySelector('#resumeBtn').addEventListener('click', ev=> {
  tl.resume();
}, false);