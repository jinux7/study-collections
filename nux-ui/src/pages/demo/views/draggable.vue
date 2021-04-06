<template>
  <div>
    <img :src="imgUrl" style="width:100%;height:150px;">
    <nux-draggable v-model="draggableList">
      <div class="divItem"
      v-for="(item,index) in draggableList" :key=index @click="onDraggableClick(item)">
      <img :src="item.url">
      <i class="del" @click="onDel(index, $event)">x</i>
      </div>
    </nux-draggable>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      imgUrl: '',
      draggableList: [
        {name: 1, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.sinaimg.cn%2FIT%2F2009%2F0221%2F2009221945572973.gif&refer=http%3A%2F%2Fi0.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619936311&t=99bf8454aee21caa9b8b9f4ae49ecd97'},
        {name: 2, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbbs.jf311.com%2Fdata%2Fattachment%2Fforum%2F201505%2F25%2F113407e6v4pom4yen44ee4.jpg&refer=http%3A%2F%2Fbbs.jf311.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619936480&t=750cf1ea050a5a8c27b537928d87647d'},
        {name: 3, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fs5.sinaimg.cn%2Fbmiddle%2F4e7600d07bbc7bcbdc1c4&refer=http%3A%2F%2Fs5.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619936480&t=f381fb5f0e9edbfd442f59539c773149'},
        {name: 4, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimage2.sina.com.cn%2Fbj%2Fart%2F2004-06-08%2FU91P52T4D48210F160DT20040608141215.jpg&refer=http%3A%2F%2Fimage2.sina.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619936480&t=65bf20d099909c35a0b979fa9d11cadf'},
        {name: 5, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180102%2Fe5e6ae1b20b64be6a24ff22d42c61408.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619936480&t=e219b298f9a455350c8b14d6fcc764c3'}
      ]
    }
  },
  components: {
  },
  mounted() {
    this.imgUrl = this.draggableList[0].url;
  },
  methods: {
    onDraggableClick(item) {
      this.imgUrl = item.url;
    },
    onDel(inx, $evt) {
      $evt.stopPropagation();
      this.draggableList.splice(inx, 1);
    },
    onPopMsgClick() {
      this.$popMsg('pop消息');
    },
    onMessageClick() {
      this.$message({
        title: '提示',
        text: '消息提示框',
        // okBtnTxt: '知道了',
      }); 
    },
    onConfirmClick() {
      this.$confirm({
        title: '提示',
        text: '消息提示框',
        callBack() {
          console.log('您点击了是按钮');
        }
      }); 
    },
    onLoadingClick() {
      this.$showLoadingPlane();
      setTimeout(()=> {
        this.$hideLoadingPlane();
      }, 5000);
    },
    // 
    delSlipItem() {
      // console.log(this.$refs.demo1, this.$refs.demo2);
      this.$refs.demo1.restSlide();
    }
  }
}
</script>

<style lang="scss" scoped>
.divItem {
  position: relative;
  width: 120px;
  height: 120px;
  line-height: 120px;
  margin:0 5px;
  overflow: hidden;
  .del {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 10px;
  }
}
</style>
