import { Stage, Layer, Text, Shape } from 'konva'

var nMap = document.getElementById('map');
var width = nMap.offsetWidth;
var height = nMap.offsetHeight;
var baseX = 100, baseY = 300;
var stage = new Stage({
  container: 'map',
  width: width,
  height: height,
});

var layer = new Layer();
// 长方体
var rect1 = new Konva.Rect({
  x: baseX-80,
  y: baseY-25,
  // offsetX: 50,
  // offsetY: 25,
  width: 100,
  height: 50,
  fill: '#cccccc',
  shadowBlur: 2,
  cornerRadius: 10,
});
// 文字
var textNode = new Text({
  x: baseX-80,
  y: baseY-25,
  // offsetX: 50,
  // offsetY: 25,
  text: 'JAVASCRIPT',
  fontSize: 18,
  fontFamily: 'Calibri',
  fill: '#555',
  width: 100,
  height: 50,
  align: 'center',
  verticalAlign: 'middle'
});

textNode.on('dblclick dbltap', () => {
  // hide text node and transformer:
  textNode.hide();
  // tr.hide();
  layer.draw();

  // create textarea over canvas with absolute position
  // first we need to find position for textarea
  // how to find it?

  // at first lets find position of text node relative to the stage:
  var textPosition = textNode.absolutePosition();

  // so position of textarea will be the sum of positions above:
  var areaPosition = {
    x: stage.container().offsetLeft + textPosition.x,
    y: stage.container().offsetTop + textPosition.y,
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
    layer.draw();
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
      removeTextarea();
    }
  }
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });
});

// 曲线
var bezi1 = new Shape({
  x: 0,
  y: 0,
  // fill: 'green',
  stroke: 'black',
  // width: 500,
  // height: 50,
  sceneFunc: function (context, shape) {
    context.beginPath();
    context.moveTo(baseX, baseY);
    context.bezierCurveTo(baseX, baseY-100, baseX, baseY-200, baseX+30, baseY-200);
    context.moveTo(100, 300);
    context.bezierCurveTo(baseX, baseY+100, baseX, baseY+200, baseX+30, baseY+200);
    context.fillStrokeShape(shape);
  }
});

// add the shape to the layer
layer.add(rect1);
layer.add(textNode);
layer.add(bezi1);
rect1.zIndex(2);
textNode.zIndex(5);

// add the layer to the stage
stage.add(layer);