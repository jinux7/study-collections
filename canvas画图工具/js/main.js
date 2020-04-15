;(function(window, undefined) {
  var nPencil = document.getElementById('pencil');
  var nEraser = document.getElementById('eraser');
  var nClearCanvas = document.getElementById('clearCanvas');
  var nDownload = document.getElementById('download');
  var canvas = document.getElementById('canvas');
  var cvs = canvas.getContext('2d');  
  var drawing =false;
  var penWeight = 1;      //画笔粗细  
  var penColor = '#000000';  //画笔颜色

  // 画图功能
  function draw() {
    cvs.globalCompositeOperation = 'source-over'; // 画笔改成绘图模式
    canvas.onmousedown = function(e){  
      /*找到鼠标（画笔）的坐标*/  
      var start_x = e.pageX - getTopLeftInBody(canvas).left;
      var start_y = e.pageY -  getTopLeftInBody(canvas).top;
      cvs.beginPath();    //开始本次绘画  
      cvs.moveTo(start_x, start_y);   //画笔起始点  
      /*设置画笔属性*/  
      cvs.lineCap = 'round';  
      cvs.lineJoin ="round";  
      cvs.strokeStyle = penColor;     //画笔颜色  
      cvs.lineWidth = penWeight;      //画笔粗细
      canvas.onmousemove = function(e){  
        /*找到鼠标（画笔）的坐标*/  
        var move_x = e.pageX - getTopLeftInBody(canvas).left; 
        var move_y = e.pageY -  getTopLeftInBody(canvas).top;  
        cvs.lineTo(move_x, move_y);     //根据鼠标路径绘画  
        cvs.stroke();   //立即渲染  
      }
      canvas.onmouseup = function(e){
            cvs.closePath();    //结束本次绘画
            canvas.onmousemove = null;  
            canvas.onmouseup = null;  
        }  
      canvas.onmouseleave = function(){
          cvs.closePath();
          canvas.onmousemove = null;  
          canvas.onmouseup = null; 
      }
    }
  }
  // 橡皮檫功能
  function eraser() {
    cvs.lineWidth = 10;
    cvs.globalCompositeOperation = "destination-out";  
    function getBoundingClientRect(x,y){
      var box = canvas.getBoundingClientRect(); //获取canvas的距离浏览器视窗的上下左右距离
      return {x:x-box.left,
              y:y-box.top
      }
    }
    canvas.onmousedown = function(e){
        var first = getBoundingClientRect(e.clientX,e.clientY);
        cvs.save();
        cvs.beginPath();
        cvs.moveTo(first.x,first.y);
        drawing = true;
    }
    canvas.onmousemove = function(e){
        if(drawing){
            var move = getBoundingClientRect(e.clientX,e.clientY);
            cvs.save();
            cvs.lineTo(move.x,move.y);
            cvs.stroke()
            cvs.restore()
        }
    }
    canvas.onmouseup = function(){
        drawing = false;
    }
    canvas.onmouseleave = function(){
        drawing = false;
        canvas.onmouseup();
    }
  }
  // 清除画布功能
  function clearCanvas() {
    var width = canvas.width,
        height = canvas.height;
    cvs.clearRect(0, 0, width, height);
  }
  // 下载图片功能
  function saveImage () {
    var nA = document.createElement('a');
    nA.download = "canvasImage.png";
    var image = new Image();
    var imgURL = canvas.toDataURL("image/png");
    nA.href = imgURL;
    document.body.appendChild(nA);
    nA.click();
  }
  // 画笔按钮添加点击事件
  nPencil.addEventListener('click', function(ev) {
    this.style.backgroundColor = '#cccccc';
    nEraser.style.backgroundColor = '#ffffff';
    canvas.style.cursor = 'url(../img/pencil.png) 13 23, crosshair';
    draw(); 
  }, false);
  // 橡皮檫按钮添加点击事件
  nEraser.addEventListener('click', function(ev) {
    this.style.backgroundColor = '#cccccc';
    nPencil.style.backgroundColor = '#ffffff';
    canvas.style.cursor = 'url(../img/precise.png) 16 16, crosshair';
    eraser(); 
  }, false);
  // 清空画布按钮添加点击事件
  nClearCanvas.addEventListener('click', function(ev) {
    clearCanvas();
  }, false);
  // 下载图片按钮添加点击事件
  nDownload.addEventListener('click', function(ev) {
    saveImage();
  }, false);
  // 选取颜色panel添加点击事件
  var nPanelColor = document.querySelector('.panel-color');
  nPanelColor.addEventListener('click', function(ev) {
    selectColor(ev.target.className);
  }, false);
  // 字体粗细添加事件
  var nFontWeight = document.querySelector('#fontWeight');
  nFontWeight.addEventListener('change', function(ev) {
    selectWeight(ev.target.value);
  }, false);
  // 选择颜色函数
  function selectColor(colorStr) {
    penColor = colorStr;
    document.querySelector('.current-color').style.background = colorStr;
  }
  // 选择字体粗细函数
  function selectWeight(weightStr) {
    penWeight = weightStr;
  }
  // 工具函数
  function getTopLeftInBody(element) {
    var actualTop = element.offsetTop,
        actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
    　actualTop += current.offsetTop;
      actualLeft += current.offsetLeft; 
    　current = current.offsetParent;
    }
    return {
      top: 　actualTop,
      left: actualLeft
    }
  }  

  draw();

})(window)