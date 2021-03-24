import { Stage, Layer, Rect, Text, Shape } from 'konva'
import config from './config'
import root from './rootNode';

export default function draw(node) {
  let layer = node.layer,
      children = node.children;
  if(node.type === 'node') {
    let rectNode = drawRect(node);
    let textNode = drawText(node, rectNode);
    layer.add(rectNode);
    layer.add(textNode);
    rectNode.zIndex(1);
    textNode.zIndex(2);
    if(node.parent) {
      let lineNode = drawLine(node);
      layer.add(lineNode);
    }
  }
  if(node.type === 'comment') {
    let rectNode = drawRectComment(node);
    let textNode = drawTextComment(node, rectNode);
    layer.add(rectNode);
    layer.add(textNode);
    rectNode.zIndex(1);
    textNode.zIndex(2); 
  }

  // add the layer to the stage
  config.stage.add(layer);
  if(children.length > 0) {
    let moveY = children.length * config.nodeSpaceY/2 - config.nodeSpaceY/2;
    children.forEach((item, inx)=> {
      item.xVal(config.nodeX);
      item.yVal(item.parent.yVal() + inx*config.nodeSpaceY - moveY);
      draw(item);
    });
  }
}
// 画一个矩形-node
function drawRect(node) {
  let rect = new Rect({
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    fill: '#cccccc',
    shadowBlur: 2,
    cornerRadius: 10,
  });
  if(node.selected) {
    rect.stroke('#2994e8');
    rect.strokeWidth(2);
    config.currentNode = node;
    config.currentNodeWrap = rect;
  }
  return rect;
}
// 写文字-node
function drawText(node, rectNode) {
  let textNode = new Text({
    x: node.x,
    y: node.y,
    text: node.text,
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    width: node.width,
    height: node.height,
    align: 'center',
    verticalAlign: 'middle'
  });
  // 添加点击事件
  textNode.on('mouseup', function(evt) {
    selected2false(root);
    node.selected = true;
    if(config.currentNodeWrap) {
      config.currentNodeWrap.strokeWidth(0);
      config.currentNodeWrap.getLayer().draw();
    }
    config.currentNodeWrap = rectNode;
    config.currentNode = node;
    rectNode.stroke('#2994e8');
    rectNode.strokeWidth(2);
    rectNode.getLayer().draw();
  });
  // 修改文字事件
  textNode.on('dblclick dbltap', ()=> {
    // hide text node and transformer:
    textNode.hide();
    // tr.hide();
    node.layer.draw();
  
    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?
  
    // at first lets find position of text node relative to the stage:
    var textPosition = textNode.absolutePosition();
  
    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: config.stage.container().offsetLeft + textPosition.x,
      y: config.stage.container().offsetTop + textPosition.y,
    };
  
    // create textarea and style it
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
  
    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    var rotation = textNode.rotation();
    var transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }
  
    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';
  
    textarea.style.transform = transform;
  
    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';
  
    textarea.focus();
  
    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
      textNode.show();
      // tr.show();
      // tr.forceUpdate();
      node.layer.draw();
    }
  
    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }
  
      var isEdge =
        document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }
  
    textarea.addEventListener('keydown', function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        node.text = textarea.value; // 修改后的文字更新到node对象数据中
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });
  
    textarea.addEventListener('keydown', function (e) {
      var scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + 'px';
    });
  
    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        node.text = textarea.value; // 修改后的文字更新到node对象数据中
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  });
  return textNode;
}
// 画贝塞尔曲线或直线-node
function drawLine(node) {
  return new Shape({
    x: 0,
    y: 0,
    stroke: 'black',
    sceneFunc: function (context, shape) {
      let parentX = node.parent.xVal(),
          parentY = node.parent.yVal() + node.parent.height/2; 
      // console.log(node.x, node.y, parentX, parentY);
      context.beginPath();
      context.moveTo( 0, parentY);
      // context.bezierCurveTo(parentX,325, parentX,100, parentX+20, 100);
      context.bezierCurveTo(0,parentY, 0,node.y+25, 20, node.y+25);
      context.fillStrokeShape(shape);
      context.closePath();
    }
  });
}
// 画一个矩形-comment
function drawRectComment(node) {
  let rect = new Rect({
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    stroke: '#eeeeee',
    fill: '#ffffff',
    shadowBlur: 0,
    cornerRadius: 2,
  });
  return rect;
}
// 写文字-comment
function drawTextComment(node) {
  let textNode = new Text({
    x: node.x + 5,
    y: node.y,
    text: node.text,
    fontSize: 14,
    fontFamily: 'Calibri',
    // fill: '#555',
    width: node.width,
    height: node.height,
    align: 'left',
    verticalAlign: 'middle'
  });
  // 修改文字事件
  textNode.on('dblclick dbltap', () => {
    // hide text node and transformer:
    textNode.hide();
    // tr.hide();
    node.layer.draw();
  
    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?
  
    // at first lets find position of text node relative to the stage:
    var textPosition = textNode.absolutePosition();
  
    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: config.stage.container().offsetLeft + textPosition.x,
      y: config.stage.container().offsetTop + textPosition.y,
    };
  
    // create textarea and style it
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
  
    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    var rotation = textNode.rotation();
    var transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }
  
    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';
  
    textarea.style.transform = transform;
  
    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';
  
    textarea.focus();
  
    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
      textNode.show();
      // tr.show();
      // tr.forceUpdate();
      node.layer.draw();
    }
  
    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }
  
      var isEdge =
        document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }
  
    textarea.addEventListener('keydown', function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        node.text = textarea.value; // 修改后的文字更新到node对象数据中
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });
  
    textarea.addEventListener('keydown', function (e) {
      var scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + 'px';
    });
  
    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        node.text = textarea.value; // 修改后的文字更新到node对象数据中
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  });
  return textNode;
}
// 将node节点的所有selected置为false
function selected2false(node) {
  node.selected = false;
  if(node.children.length > 0) {
    node.children.forEach(item=> {
      selected2false(item);
    });
  }
}