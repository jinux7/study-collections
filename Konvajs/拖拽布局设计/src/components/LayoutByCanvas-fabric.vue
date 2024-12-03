<template>
  <div class="content-wrap">
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
    <div class="middle" @dragover="onMiddleDropOver" @drop="onMiddleDrop" :draggable="true">
      <canvas id="canvas-wrap"></canvas>
    </div>
    <div class="right">
      <el-form ref="formRef" :model="formData">
        <div class="panel" v-for="(item1, index1) in rightList">
          <div class="box" v-show="index1===currentIndex">
            <el-row v-for="(item2, index2) in item1.props">
              <el-form-item :label="item2.label" :prop="'['+index1+'].'+item2.propName" :rules="item2.rules">
                <el-input v-model="formData[index1][item2.propName]" />
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
      <div style="text-align: center;margin-top: 50px;">
        <el-button type="primary" @click="onSave">点击</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { videoItem, carouselItem, imageItem } from './items'
import * as fabric from 'fabric'
import { Canvas } from 'fabric'

const formRef = ref(null);
let canvas;
let shapeIndex = 0;
let currentIndex = ref(-1);
const rightList = ref([]);
const formData = reactive([]);
// 左侧数据
const leftList = [videoItem, carouselItem, imageItem ];
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
let canvasWidth, canvasHeight;
onMounted(()=> {
  const nMiddle = document.querySelector('.middle');
  // console.log(nMiddle.getBoundingClientRect());
  canvas = new Canvas('canvas-wrap', {
    width: nMiddle.getBoundingClientRect().width,
    height: nMiddle.getBoundingClientRect().height
  });
  canvasWidth = canvas.getWidth();
  canvasHeight = canvas.getHeight();
  
  canvas.on('object:moving', function (e) {
    e.target&&limitMovement(e);
  });
  canvas.on('mouse:up', function (e) {
    e.target&&limitMovement(e);
  });
  canvas.on('selection:cleared', function() {
    currentIndex.value = -1;
  });
});
const limitMovement = e=> {
  const obj = e.target;
  // 计算对象的边界
  const leftBound = obj.getBoundingRect().left;
  const rightBound = obj.getBoundingRect().left + obj.getBoundingRect().width;
  const topBound = obj.getBoundingRect().top;
  const bottomBound = obj.getBoundingRect().top + obj.getBoundingRect().height;

  // 防止对象移动到画布之外
  if (leftBound < 0) {
    obj.left = 0;
  }
  if (rightBound > canvasWidth) {
    obj.left = canvasWidth - obj.getBoundingRect().width;
  }
  if (topBound < 0) {
    obj.top = 0;
  }
  if (bottomBound > canvasHeight) {
    obj.top = canvasHeight - obj.getBoundingRect().height;
  }

  // 更新对象的位置
  obj.setCoords();
  canvas.requestRenderAll();
}
const createShape = option=> {
  // 创建图片
  // fabric.Image.fromURL(option.item.img, function(img) {
  //   console.log(option.item.img);
  //   canvas.add(img).renderAll();
  // });

  let canvasImg = null;
  const nImg = new Image();
  nImg.onload = ()=> {
    canvasImg = new fabric.FabricImage(nImg, {
      left: option.x,
      top: option.y,
      width: nImg.width,
      height: nImg.height,
      customType: option.item.type,
      customIndex: shapeIndex++,
    });
    canvas.add(canvasImg);
    canvas.setActiveObject(canvasImg);
    canvasImg.scaleToWidth(200);
    // canvasImg.scaleToHeight(200);
    // 隐藏控制点
    canvasImg.setControlVisible('mtr', false);
    // canvasImg.setControlVisible('ml', false);
    canvasImg.setControlVisible('mr', false);
    // canvasImg.setControlVisible('mt', false);
    canvasImg.setControlVisible('mb', false);

    canvasImg.on('mousedown', function() {
      currentIndex.value = canvasImg.customIndex;
    });
  }
  nImg.src = option.item.imgUrl;
  

  // 创建一个矩形对象
  // var rect = new fabric.Rect({
  //   left: option.x,
  //   top: option.y,
  //   width: 100,
  //   height: 200,
  //   fill: 'transparent',
  //   stroke: 'red',
  //   strokeWidth: 3,
  //   lockRotation: true,
  //   hasRotatingPoint : false
  // });
  // rect.setControlVisible('mtr', false);
  // // 将矩形添加到画布上
  // canvas.add(rect);
  // console.log(rect, 998);
}
// 左侧drag事件
const onLeftDrag = ev=> {
  // console.log(ev, 998);
}
const onLeftDragEnd = ev=> {
  
}
const onLeftMousedown = (item, ev)=> {
  currentElementOffset.x = ev.offsetX;
  currentElementOffset.y = ev.offsetY;
  currentElement = item;
  // console.log(currentElementOffset, 'down');
}
// 中间dropOver事件
const onMiddleDropOver = ev=> {
  ev.preventDefault();
  // console.log(ev, 'over');
}
// 中间drop事件
const onMiddleDrop = ev=> {
  middleElementPosition.x = ev.layerX - currentElementOffset.x;
  middleElementPosition.y = ev.layerY - currentElementOffset.y;
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

// save
const onSave = ev=> {
  formRef.value.validate(valid=> {
    if(valid) {
      const objArr = canvas.getObjects();
      objArr.forEach((item, index)=> {
        formData[index].x = item.getBoundingRect().left;
        formData[index].y = item.getBoundingRect().top;
        formData[index].width = item.getBoundingRect().width;
        formData[index].height = item.getBoundingRect().height;
      });
      console.log(formData);
      
    }else {
      console.log('fail');
    }
  })
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
    border-right: 1px solid #aaaaaa40;
    border-bottom: 1px solid #aaaaaa40;
    background-image: linear-gradient(#aaaaaa40 1px, transparent 0), linear-gradient(90deg, #aaaaaa40 1px, transparent 0), linear-gradient(#aaa 1px, transparent 0), linear-gradient(90deg, #aaa 1px, transparent 0);
    background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
 
  }
  .right {
    width: 350px;
    .panel {
      .box {
        padding: 20px 10px;
      }
    }
  }
}
</style>
