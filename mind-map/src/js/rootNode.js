import { Layer } from 'konva'
import config from './config'
import Node from './nodeClass'

let nMap = document.getElementById('map');
let height = nMap.offsetHeight;

let root = new Node({
    type: 'node',
    parent: null,
    text: 'javascript',
    layer: new Layer({
      x: 0,
      y: 0
    }),
    x: config.nodeX,
    y: height/2,
    width: 100,
    height: 50,
  });
let node1_1 = new Node({
  type: 'node',
  parent: root,
  text: '基础语法',
  layer: new Layer({
    x: root.x + root.width,
    y: 0
  }),
  x: root.x,
  // y: root.y - 100,
  width: 100,
  height: 50,
});
let node1_2 = new Node({
  type: 'node',
  parent: root,
  text: '函数作用域',
  layer: new Layer({
    x: root.x + root.width,
    y: 0
  }),
  x: root.x,
  // y: root.y + 100,
  width: 100,
  height: 50,
});
let node1_3 = new Node({
  type: 'node',
  parent: root,
  text: 'Blob大文件',
  layer: new Layer({
    x: root.x + root.width,
    y: 0
  }),
  x: root.x,
  // y: root.y + 100,
  width: 100,
  height: 50,
});
let node1_4 = new Node({
  type: 'node',
  parent: root,
  text: 'node1_4',
  layer: new Layer({
    x: root.x + root.width,
    y: 0
  }),
  x: root.x,
  // y: root.y + 100,
  width: 100,
  height: 50,
});
let node1_5 = new Node({
  type: 'node',
  parent: root,
  text: 'node1_5',
  layer: new Layer({
    x: root.x + root.width,
    y: 0
  }),
  x: root.x,
  // y: root.y + 100,
  width: 100,
  height: 50,
});
let node2_1 = new Node({
  type: 'node',
  parent: node1_3,
  text: 'Blob大文件',
  layer: new Layer({
    x: node1_3.x + node1_3.width + node1_3.layer.x(),
    y: 0
  }),
  x: node1_3.x,
  // y: root.y + 100,
  width: 100,
  height: 50,
});
let node2_2 = new Node({
  type: 'node',
  parent: node1_3,
  text: 'Blob大文件',
  layer: new Layer({
    x: node1_3.x + node1_3.width + node1_3.layer.x(),
    y: 0
  }),
  x: node1_3.x,
  // y: root.y + 100,
  width: 100,
  height: 50,
});
node1_3.children = [node2_1, node2_2] 
root.children = [];

export default root;