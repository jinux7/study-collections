<template>
  <div class="nux-draggable">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'nux-draggable',
  props: [ 'value' ],
  mounted() {
    this.addEvt();
  },
  methods: {
    addEvt() {
      const wrapEl = this.$el;
      const childrenEl = wrapEl.children;
      let copyItem;
      let touchTime;
      let timer;
      let self = this;
      for(let i=0,len=childrenEl.length; i<len; i++) {
        let item = childrenEl[i];
        item.ontouchstart = function(evt) {
          touchTime = Date.now();
          timer = setTimeout(()=> {
            evt.preventDefault();
            let touchDown = {
              x: evt.targetTouches[0].pageX,
              y: evt.targetTouches[0].pageY
            }
            copyItem = item.cloneNode(true); 
            item.style.opacity = '.5';
            let itemX = item.offsetLeft,
                itemY = item.offsetTop;
            copyItem.style.position = `absolute`;
            copyItem.style.left = `${itemX}px`;
            copyItem.style.top = `${itemY}px`;
            copyItem.style.margin = 0;
            copyItem.style.boxShadow = `0 0 2px 2px rgba(0,0,0,.5)`;
            wrapEl.appendChild(copyItem);
            // copyItem添加touchmove事件
            wrapEl.ontouchmove = function(evt) {
              evt.preventDefault();
              copyItem.style.left = itemX + evt.targetTouches[0].pageX - touchDown.x + 'px';
              copyItem.style.top = itemY + evt.targetTouches[0].pageY - touchDown.y + 'px';
            }
            wrapEl.ontouchend = function(evt) {
              evt.preventDefault();
              item.style.opacity = '1';
              self.changeSort(childrenEl, copyItem, i);
              // 手指抬起后的收尾操作
              copyItem = null;
              wrapEl.ontouchmove = wrapEl.ontouchend = null;
            }
          }, 500);
          // 
          item.ontouchend = function(evt) {
            if(Date.now()-touchTime<500) {
              clearTimeout(timer);
            }else {
              evt.preventDefault();
            }
            item.ontouchend = null;
          }
        }
      }
    },
    changeSort(childrenEl, copyItem, copyItemInx) {
      let insertIndex = null;
      let bReturn = false;
      let copyItemCenter = parseInt(realStyle(copyItem, 'left')) + parseInt(realStyle(copyItem, 'width'))/2;
      if(copyItem.offsetTop + parseInt(realStyle(copyItem, 'height')) < 0 || copyItem.offsetTop > parseInt(realStyle(copyItem, 'height'))) {
        bReturn = true;
      }
      copyItem.parentElement.removeChild(copyItem);
      if(bReturn) return void 0;
      let minLeft = childrenEl[0].offsetLeft,
          maxRight = childrenEl[childrenEl.length-1].offsetLeft + parseInt(realStyle(childrenEl[childrenEl.length-1], 'width'))
      for(let i=0; i<childrenEl.length; i++) {
        let item = childrenEl[i];
        let left = item.offsetLeft;
        let itemPosition = {
          width: parseInt(realStyle(item, 'width')),
          left: left,
          right: item.nextElementSibling ? item.nextElementSibling.offsetLeft : (left+parseInt(realStyle(item, 'width')))
        }
        // console.log(copyItemCenter, maxRight);
        if(copyItemCenter<minLeft) {
          insertIndex = 0;
          break;
        }else  if(copyItemCenter>itemPosition.left&&copyItemCenter<itemPosition.right) {
          if(copyItemCenter<(itemPosition.right-itemPosition.width/2)) {
            insertIndex = i;
          }else {
            insertIndex = i+1;
          }
          break;
        }else if(copyItemCenter>maxRight) {
          insertIndex = childrenEl.length;
          break;
        }
      }
      let tempArr = Object.assign([], this.value);
      let removeItem = tempArr.splice(copyItemInx, 1)[0];
      this.value.splice(insertIndex, 0, removeItem);
      if(copyItemInx>=insertIndex) {
        this.value.splice(copyItemInx+1, 1);
      }else {
        this.value.splice(copyItemInx, 1);
      }
    }
  },
}
// 处理样式
function realStyle(_elem, _style) {
    var computedStyle;
    if ( typeof _elem.currentStyle != 'undefined' ) {
        computedStyle = _elem.currentStyle;
    } else {
        computedStyle = document.defaultView.getComputedStyle(_elem, null);
    }

    return _style ? computedStyle[_style] : computedStyle;
};
function copyComputedStyle(src, dest) {
    var s = realStyle(src);
    for ( var i in s ) {
        // Do not use `hasOwnProperty`, nothing will get copied
        if ( typeof i == "string" && i != "cssText" && !/\d/.test(i) ) {
            // The try is for setter only properties
            try {
                dest.style[i] = s[i];
                // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
                // overwritten.  So make sure to reset this property. (hackyhackhack)
                // Other properties may need similar treatment
                if ( i == "font" ) {
                    dest.style.fontSize = s.fontSize;
                }
            } catch (e) {}
        }
    }
};
</script>
<style lang="scss" scoped>
.nux-draggable {
  display: flex;
  position: relative;
  img {
    pointer-events:none;
  }
}
</style>