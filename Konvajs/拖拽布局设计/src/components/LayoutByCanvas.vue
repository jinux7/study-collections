<template>
  <div class="content-wrap" @click="onContentWrapClick">
    <div class="left">
      <ul>
        <li v-for="item in leftList" :key="item.type" 
          @drag="onLeftDrag" 
          @dragend="onLeftDragEnd"
          @mousedown="onLeftMousedown(item, $event)" 
          :draggable="true">
          <img :src="item.imgUrl" alt="img" :draggable="false">
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div class="middle" @dragover="onMiddleDropOver" @drop="onMiddleDrop" :draggable="false">
      <div id="canvas-wrap"></div>
    </div>
    <div class="right">
      <el-form ref="formRef" :model="formData" label-width="100">
        <div class="panel" v-for="(item1, index1) in rightList">
          <div class="box" v-show="index1===currentIndex">
            <h4>{{ item1.name }}</h4>
            <el-row v-for="(item2, index2) in item1.props">
              <el-form-item :label="item2.label" :prop="'['+index1+'].'+item2.propName" :rules="item2.rules">
                <el-input v-if="item2.type==='input'" v-model="formData[index1][item2.propName]" />
                <el-color-picker v-else-if="item2.type==='color'" 
                    v-model="formData[index1][item2.propName]" show-alpha :predefine="predefineColors" />
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
      <div v-show="currentIndex!=-1" style="text-align:center;margin-top: 50px;">
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </div>
    <div id="layout-contextmenu">
      <span>删除</span>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { videoItem, imageItem, textItem, weatherItem, clockItem, worldclockItem, typeMap } from './items'
import Konva from 'Konva'

const DEFAULTWIDTH = 740,
      DEFAULTHEIGHT = 426;
const formRef = ref(null);
let wrapWidth, wrapHeight;
let stage, layer, tr;
let shapeIndex = 0;
let activeShap = null;
let currentIndex = ref(-1);
const rightList = ref([]);
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]);
const formData = reactive([]);
let bOutBound = false;
let TransformScaleX = 1;
// 左侧数据
const leftList = [imageItem, videoItem, textItem, weatherItem, clockItem, worldclockItem ];
// middle element position
const middleElementPosition = {
  x: 0,
  y: 0
}
const currentElementOffset = {
  x: 0,
  y: 0
}
let currentElement = null;
let shapeWidth= 100, shapeHeight = 100;

onMounted(()=> {
  const nMiddle = document.querySelector('.middle');
  wrapWidth = nMiddle.getBoundingClientRect().width;
  wrapHeight = wrapWidth * DEFAULTHEIGHT / DEFAULTWIDTH;
  stage = new Konva.Stage({
    container: 'canvas-wrap',
    width: wrapWidth,
    height: wrapHeight
  });
  // stage添加事件

  stage.on('click', ev=> {
    if(ev.target === stage) {
      tr.nodes([]);
      currentIndex.value = -1;
    }
  });  
  layer = new Konva.Layer();
  stage.add(layer);
  tr = new Konva.Transformer({
    rotateEnabled: false,
    enabledAnchors: ['top-left', 'top-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center', 'bottom-left', 'bottom-right'],
    boundBoxFunc: function(oldBoundBox, newBoundBox) {
      let shapeWidth = activeShap.scaleX() * activeShap.width(),
          shapeHeight = activeShap.scaleY() * activeShap.height();
      if((newBoundBox.x < 0) || (newBoundBox.y < 0) || (newBoundBox.x+shapeWidth>wrapWidth) || (newBoundBox.y+shapeHeight>wrapHeight)) {
        return oldBoundBox;
      }
      return newBoundBox;
    }
  });
  // tr.on('transform', ev=> {
  //   let x = activeShap.attrs.x,
  //       y = activeShap.attrs.y;
    
  //   if(!bOutBound) {
  //     TransformScaleX = activeShap.scaleX();
  //   }
  //   console.log(x, y);
  //   if(x<=0) {
  //     bOutBound = true;
  //     activeShap.setX(0);
  //     activeShap.setScaleX(TransformScaleX);
  //     tr.forceUpdate();
  //   }else {
  //     bOutBound = false;
  //   }
  // });
  layer.add(tr);

  drawShapeByData(

  [{"type":"screen","width":1310,"height":754.1351351351351},{"x":183,"y":108,"width":325,"height":325,"zIndex":0,"type":"image","dataType":"flightNo","fill":"rgba(255, 69, 0, 1)","data":{"prefixText":"1","text":"1","placeholder":"1"}},{"x":897,"y":414,"width":99,"height":275,"zIndex":1,"type":"video","dataType":"flightNo","fill":"rgba(255, 140, 0, 1)","data":{"prefixText":"2","text":"2","placeholder":"2"}},{"x":568,"y":112,"width":286,"height":99,"zIndex":2,"type":"text","dataType":"flightNo","fill":"rgba(255, 215, 0, 1)","data":{"prefixText":"3","text":"3","placeholder":"3"}},{"x":394,"y":547,"width":100,"height":100,"zIndex":3,"type":"worldclock","dataType":"flightNo","fill":"","data":{"prefixText":"","text":"","placeholder":""}},{"x":468,"y":293,"width":100,"height":100,"zIndex":4,"type":"clock","dataType":"flightNo","fill":"","data":{"prefixText":"","text":"","placeholder":""}}]

  );
});

const createShape = option=> {
  let canvasImg = null;
  const nImg = new Image();
  nImg.onload = ()=> {
    canvasImg = new Konva.Image({
      x:  option.x,
      y:  option.y,
      image: nImg,
      width: option.width || shapeWidth,
      height: option.height || shapeHeight,
      draggable: true,
      centeredScaling: true,
      // stroke: '#dddddd',
      // strokeWidth: 1,
      customType: option.item.type,
      customIndex: shapeIndex++,
      dragBoundFunc(currentPos) {
        let width = canvasImg.width() * canvasImg.scaleX(),
            height = canvasImg.height() * canvasImg.scaleY();
        return {
          // x: currentPos.x < 0 ? 0 : currentPos.x,
          // y: currentPos.y > 150 ? 150 : currentPos.y
          x: (()=> {
            if(currentPos.x <= 0) {
              return 0;
            }else if(currentPos.x+width >= wrapWidth) {
              return wrapWidth - width;
            }else {
              return currentPos.x;
            }
          })(),
          y: (()=> {
            if(currentPos.y <= 0) {
              return 0;
            }else if(currentPos.y+height >= wrapHeight) {
              return wrapHeight - height;
            }else {
              return currentPos.y;
            }
          })(),
        }
      },
    });
    canvasImg.on('click dragstart', ev=> {
      activeShap = canvasImg;
      initShapeZIndex();
      currentIndex.value = canvasImg.attrs.customIndex;
      canvasImg.setZIndex(9999); 
      tr.setZIndex(10000);
      tr.nodes([canvasImg]);
    });
    canvasImg.on('contextmenu', ev=> {
      const nContextmenu = document.getElementById('layout-contextmenu');
      ev.evt.preventDefault();
      const mouseX = ev.evt.pageX,
            mouseY = ev.evt.pageY;
      nContextmenu.style.display = 'block';
      nContextmenu.style.left = mouseX + 10 + 'px';
      nContextmenu.style.top = mouseY + 'px';
      nContextmenu.addEventListener('click', handler, false);
      function handler(ev) {
        const index = canvasImg.attrs.customIndex;
        rightList.value.splice(index, 1);
        formData.splice(index, 1);
        canvasImg.remove();
        tr.nodes([]);
        currentIndex.value = -1;
        initShapeCustomIndex();
        // nContextmenu.style.display = 'none';
        nContextmenu.removeEventListener('click', handler, false);
      }
    });
    layer.add(canvasImg);
    tr.setZIndex(1000);
    tr.nodes([canvasImg]);
    initShapeCustomIndex();
    currentIndex.value = canvasImg.attrs.customIndex;
    activeShap = canvasImg;
  }
  nImg.src = option.item.imgUrl;
}
const initShapeCustomIndex = ()=> {
  layer
    .getChildren()
    .filter(item=> {
      return item.getClassName() !== 'Transformer';
    })
    .sort((a, b)=> {
      return a._id - b._id
    })
    .forEach((item, index)=> {
      item.attrs.customIndex = index;
    });
}
const initShapeZIndex = ()=> {
  // console.log(layer);
  layer.getChildren().forEach(item=> {
    
    item.setZIndex(item.attrs.customIndex);
  });
}

// 左侧drag事件
const onLeftDrag = ev=> {
  // console.log(ev, 998);
}
const onLeftDragEnd = ev=> {
  
}
const onLeftMousedown = function(item, ev) {
  var rectPos = ev.currentTarget.getBoundingClientRect();
  currentElementOffset.x = ev.pageX - rectPos.left;
  currentElementOffset.y = ev.pageY - rectPos.top;
  // console.log(currentElementOffset);
  currentElement = item;
}
// 中间dropOver事件
const onMiddleDropOver = ev=> {
  ev.preventDefault();
}
// 中间drop事件
const onMiddleDrop = ev=> {
  middleElementPosition.x = ev.layerX - currentElementOffset.x;
  middleElementPosition.y = ev.layerY - currentElementOffset.y;
  if(middleElementPosition.x < 0) {
    middleElementPosition.x = 0;
  }
  if((middleElementPosition.x+shapeWidth) > wrapWidth) {
    middleElementPosition.x = wrapWidth - shapeWidth;
  }
  if(middleElementPosition.y < 0) {
    middleElementPosition.y = 0;
  }
  if((middleElementPosition.y+shapeHeight) > wrapHeight) {
    middleElementPosition.y = wrapHeight - shapeHeight;
  }
  createShape({
    x: middleElementPosition.x,
    y: middleElementPosition.y,
    item: currentElement
  });
  currentIndex.value = shapeIndex;
  rightList.value.push(Object.assign({}, currentElement));
  let propObj = {
    type: currentElement.type
  }
  currentElement.props.forEach(item=> {
    propObj[item.propName] = '';
  });
  formData.push(propObj);
}
const onContentWrapClick = ev=> {
  const nContextmenu = document.getElementById('layout-contextmenu');
  nContextmenu.style.display = 'none';
}
// save
const onSave = ev=> {
  formRef.value.validate(valid=> {
    if(valid) {
      const newFormData = [];
      const objArr = layer.getChildren().filter(item=> {
        return item.getClassName() !== 'Transformer';
      });
      objArr.forEach((item, index)=> {
        let width = item.width() * item.scaleX(),
            height = item.height() * item.scaleY();
        newFormData[index] = {};
        newFormData[index].x = parseInt(item.x());
        newFormData[index].y = parseInt(item.y());
        newFormData[index].width = parseInt(width);
        newFormData[index].height = parseInt(height);
        newFormData[index].zIndex = index;
        newFormData[index].type = formData[index].type;
        newFormData[index].dataType = 'flightNo';
        newFormData[index].fill = formData[index].fill;
        newFormData[index].data = {
          prefixText: formData[index].prefixText,
          text: formData[index].text,
          placeholder: formData[index].placeholder,
        };
      });
      newFormData.unshift({ type: 'screen', width: wrapWidth, height: wrapHeight });
      console.log(JSON.stringify(newFormData));
    }else {
      console.log('fail');
    }
  })
}
// 根据数据画图形
const drawShapeByData = (arr=[])=> {
  if(arr.length===0) return ;
  const screen = arr.shift();
  const ratio = wrapWidth / screen.width;
  arr.forEach(item=> {
    item.x = item.x * ratio;
    item.y = item.y * ratio;
    item.width = item.width * ratio;
    item.height = item.height * ratio;

    currentElement = typeMap[item.type];
    createShape({
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      item: currentElement
    });
    currentIndex.value = shapeIndex;
    rightList.value.push(Object.assign({}, currentElement));
    let propObj = {
      type: currentElement.type,
      ...item,
      ...item.data
    }
    formData.push(propObj);
  });
}
</script>
<style scoped>
.content-wrap {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  width: 100%;
  >div {
   height: 100vh;
   box-sizing: border-box;
   border: 1px solid #cccccc;
  }
  .left {
    width: 250px;
    ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      li {
        width: calc(50% - 20px);
        text-align: center;
        margin: 10px 10px;
        cursor: all-scroll;
        border: 1px solid #cccccc;
        box-sizing: border-box;
        img {
          width: 80%;
        }
      }
    }
  }
  .middle {
    margin: 0 5px;
    flex: 1;
    #canvas-wrap {
      border-right: 1px solid #aaaaaa40;
      border-bottom: 1px solid #aaaaaa40;
      background-image: linear-gradient(#aaaaaa40 1px, transparent 0), linear-gradient(90deg, #aaaaaa40 1px, transparent 0), linear-gradient(#aaa 1px, transparent 0), linear-gradient(90deg, #aaa 1px, transparent 0);
      background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
    }
  }
  .right {
    width: 350px;
    .panel {
      .box {
        padding: 20px 10px;
        h4 {
          text-align: center;
          margin-bottom: 20px;
        }
      }
    }
  }
}
#layout-contextmenu {
  position: fixed;
  display: none;
  padding: 3px 15px;
  height: auto;
  cursor: pointer;
  color: #ffffff;
  background-color: #000000;
  border: none;
  border-radius: 3px;
}
</style>
