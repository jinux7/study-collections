import config from "./config"
import root from './rootNode'
import draw from './draw'
import { Stage, Layer } from 'konva'
import Node from './nodeClass'

let nCreateNodeBtn = document.getElementById('createNodeBtn');
let nCreateCommentBtn = document.getElementById('createCommentBtn');
let nRemoveNodeBtn = document.getElementById('removeNodeBtn');
let nDownloadBtn = document.getElementById('downloadBtn');
// 创建标题btn
nCreateNodeBtn.onclick = function(evt) {
  if(!config.currentNode) {
    alert('请选择一个节点');
    return void 0;
  }
  if(config.currentNode.children[0]&&config.currentNode.children[0].type === 'comment') {
    alert('已经有备注的节点不能创建标题了');
    return void 0;
  }
  let newNode = new Node({
    type: 'node',
    parent: config.currentNode,
    text: 'node...',
    layer: new Layer({
      x: config.currentNode.x + config.currentNode.width + config.currentNode.layer.x(),
      y: 0
    }),
    x: config.currentNode.x,
    width: 100,
    height: 50,
  });
  config.currentNode.children.push(newNode);
  clearAllLayers(config.stage);
  draw(root);
  reactStageWidthHeight();
}
// 创建备注btn
nCreateCommentBtn.onclick = function(evt) {
  if(!config.currentNode) {
    alert('请选择一个节点');
    return void 0;
  }
  if(config.currentNode.children.length>0) {
    alert('选择一个没有后代的节点');
    return void 0;
  }
  if(config.currentNode === root) {
    alert('根节点下不能直接创建备注');
    return void 0;
  }
  let newNode = new Node({
    type: 'comment',
    parent: config.currentNode,
    text: 'comment...',
    layer: new Layer({
      x: config.currentNode.x + config.currentNode.width + config.currentNode.layer.x(),
      y: 0
    }),
    x: config.currentNode.x,
    width: 300,
    height: 50,
  });
  config.currentNode.children.push(newNode);
  clearAllLayers(config.stage);
  draw(root);
}
// 删除节点btn
nRemoveNodeBtn.onclick = function(evt) {
  if(!config.currentNode) {
    alert('请选择一个节点');
    return void 0;
  }
  if(config.currentNode === root) {
    alert('根节点无法删除');
    return void 0;
  }
  let parentNode = findParentNode(config.currentNode, root);
  let nodeIndex = parentNode.children.indexOf(config.currentNode);
  parentNode.children.splice(nodeIndex, 1);
  clearAllLayers(config.stage);
  console.log(config.currentNode);
  // config.currentNode = root;
  config.currentNodeWrap = null;
  draw(root);
}
// 下载btn
nDownloadBtn.onclick = function(evt) {
  let dataURL = config.stage.toDataURL({ pixelRatio: 3 });
  let link = document.createElement('a');
  link.download = 'stage.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link = null;
}
// 处理新添加节点后的布局
function reactStageWidthHeight(evt) {
  let minY = 0, maxY = 0, maxX=0;
  getY(root);
  function getY(root) {
    let x = root.layer.x();
    let y = root.layer.children[0].y();
    x>maxX&&(maxX=x);
    y<minY&&(minY=y);
    y>maxY&&(maxY=y);
    if(root.children.length > 0) {
      root.children.forEach(item=> {
        getY(item);
      });
    }
  }
  let stageHeight = maxY - minY;
  config.stage.height(stageHeight + 100);
  config.stage.width(maxX + 500);
  root.yVal(root.y-minY);
  clearAllLayers(config.stage);
  draw(root);
}
// 删除节点用，遍历所有node节点，找到当前节点的父节点
function findParentNode(node, root) {
  let parent = null;
  (function innerFn(node, root) {
    let children = root.children;
    if(children.length > 0) {
      for(let i=0; i<children.length; i++) {
        if(children[i] === node) {
          parent = root;
          break;
        }else {
          innerFn(node, children[i]);
        }
      }
    }
  })(node, root);
  return parent;
}
// 清除stage的layers
function clearAllLayers(stage) {
  let layers = stage.getLayers();
  // for(let i=0; i<layers.length; i++) { // for循环可以用while循环实现
  //   layers[i].destroy();
  //   i--;
  // }
  while(layers.length) {
    layers[0].destroy();
  }
}