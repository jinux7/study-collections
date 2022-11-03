import { Nuxcas, Rect, Circle, Image, Text } from "./index";
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
  left: 300,
  top: 300,
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
  top: 100,
  left: 200,
  fill: '#cccccc',
  stroke: 'red'
});
nuxcas.add(circle1);
nuxcas.add(rect1);
nuxcas.add(rect2);
nuxcas.add(img1);
nuxcas.add(img2);
nuxcas.add(circle2);
nuxcas.add(text1);