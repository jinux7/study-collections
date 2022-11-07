import { Nuxcas, Rect, Circle, Image, Text, Svg, Html } from "./index";
import imgBeidaihe from '../public/beidaihe.jpeg';
const nuxcas = new Nuxcas(document.querySelector('#canvas')!);
const rect1 = new Rect({
  top: 100,
  left: 100,
  width: 100,
  height: 100,
  fill: 'green',
  angle: 45,
  // stroke: 'red',
  strokeWidth: 0,
  rx: 5,
  ry: 5
});
const rect2 = new Rect({
  top: 100,
  left: 300,
  width: 100,
  height: 100,
  fill: 'blue',
  // stroke: 'blue',
  strokeWidth: 2,
  rx: 30,
  ry: 30
});
const img1 = new Image({
  url: imgBeidaihe,
  width: 100,
  height: 100,
  left: 100,
  top: 100,
  // angle: 60
});
const img2 = new Image({
  url: 'https://p26-passport.byteacctimg.com/img/user-avatar/7470b65342454dd6699a6cf772652260~300x300.image',
  width: 200,
  height: 200,
  left: 600,
  top: 100,
  angle: 60
});
const circle1 = new Circle({
  top: 200,
  left: 100,
  r: 50,
  fill: 'blue',
  stroke: 'red',
  strokeWidth: 2,
});
const circle2 = new Circle({
  top: 200,
  left: 500,
  r: 100,
  fill: 'skyblue',
  // stroke: 'red',
  // strokeWidth: 2,
});
const text1 = new Text({
  textStr: 'hello worldjkjlkjkljl你好啊啊啊啊啊啊啊',
  fontSize: 30,
  width: 200,
  top: 250,
  left: 250,
  fill: '#cccccc',
  stroke: 'red'
});
const svg1 = new Svg({
  svg: '<svg t="1622524892065" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9337" width="200" height="200"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="9338"></path></svg>',
  width: 100,
  height: 100,
  left:600,
  top: 300,
  angle: 60,
  scale: 2,
});
const html1 = new Html({
  html: `<div id="app">
          <style>
            #app {
              color: red;
            }
            strong {
              font-size: 32px;
              color: blue;
            }
          </style>
          <h1>这是一个html的canvas渲染</h1>
          <strong>hello world!!!</strong>
        </div>`,
  left: 300,
  top: 450,
  width: 500,
  height: 200,
});
// 动画添加
rect1.animate({
  top: 200, 
  left: 600,
  scaleX: 1.5, 
  angle: 90
}, 
{
  duration: 1000,
  onChange: nuxcas.renderAll.bind(nuxcas),
  onComplete: ()=> {
    // console.log('conplete!');
  }
});
text1.animate({
  top: 200, 
  left: 600,
  scaleX: 1.5, 
  angle: 90
}, 
{
  duration: 1000,
  onChange: nuxcas.renderAll.bind(nuxcas),
  onComplete: ()=> {
    // console.log('conplete!');
  }
});
nuxcas.add(circle1);
nuxcas.add(rect1);
nuxcas.add(rect2);
nuxcas.add(img1);
nuxcas.add(img2);
nuxcas.add(circle2);
nuxcas.add(text1);
nuxcas.add(svg1);
nuxcas.add(html1);
