import './css/main.less'
import './js/componentsbtn'
import draw from './js/draw'
import config from './js/config'
import { Stage } from 'konva'
import root from './js/rootNode'

// 创建stage
let nMap = document.getElementById('map');
let width = nMap.offsetWidth;
let height = nMap.offsetHeight;
let stage = new Stage({
  container: 'map',
  width: width,
  height: height,
});
config.stage = stage;
draw(root);