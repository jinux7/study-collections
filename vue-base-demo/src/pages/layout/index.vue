<template>
  <div class="layout">
    <div class="leftSide" ref="leftSide"> 
      <div class="logo">
        <img :src="logoImg" alt="img">
      </div>
      <div class="menuWrap" ref="menuWrap">
        <Menus :collapse="collapse"></Menus>
      </div>
    </div>
    <div class="rightSide" ref="rightSide"> 
      <div class="header">
        <div class="menuSwitch" @click="changeMenu">
          <i class="el-icon-tickets"></i>
        </div>
      </div>
      <div class="content" ref="content">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/assets/images/logo.png';
import Menus from '@/components/menu/menu';
export default {
  name: 'layout',
  data(){
    return {
      logoImg: null,
      collapse: false,
    }
  },
  components: {
   Menus
  },
  methods: {
    changeMenu: function(){
      this.collapse = !this.collapse;
      this._changeMenuWidth(this.collapse);
    },
    _changeMenuWidth(flag){
      if(flag){
        this.$refs.leftSide.style.width = '65px';
        this.$refs.rightSide.style.marginLeft = '65px';   
      }else {
        this.$refs.leftSide.style.width = '210px';
        this.$refs.rightSide.style.marginLeft = '210px';   
      }
    }
  },
  mounted(){
    const wH = document.documentElement.clientHeight; // 获取浏览器的高
    this.$refs.leftSide.style.height = wH+'px'; // 设置leftSide的高
    this.$refs.rightSide.style.height = wH+'px';  // 设置rightSide的高
    this.$refs.menuWrap.style.height = (wH-50)+'px';  // 设置menuWrap的高
    this.$refs.content.style.height = (wH-50)+'px';  // 设置content的高
    this.logoImg = Logo;  // 设置图片
  }
}
</script>

<style scoped lang="less">
  .layout {
    @leftSide_width: 210px;
    @header_height: 50px;
    .leftSide {
      width: @leftSide_width;
      float: left;
      overflow: hidden;
      .logo {
        img {
          width: 100%;
          height: 50px;;
        }
      }
      .menuWrap {
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    .rightSide {
      margin-left: @leftSide_width;
      background: #ccc;
      .header {
        height: @header_height;
        background: white;
        .menuSwitch {
          cursor: pointer;
          line-height: @header_height;
          font-size: 28px;
        }
      }
      .content {
        overflow: auto;
      }
    }
    // 过渡效果
    .fade-enter {
      opacity: 0;
    }
    .fade-enter-active {
      transition: opacity .5s;
    }

  }
</style>
