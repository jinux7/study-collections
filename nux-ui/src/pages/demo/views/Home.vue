<template>
  <div id="home">
    <h1>Home页面</h1>
    <router-link to="/About">to-about</router-link>
    <div>
      <nux-button type="" style="margin:5px;" @click="onPopMsgClick">popMsg按钮</nux-button>
      <nux-button type="primary" @click="onMessageClick">message按钮</nux-button>
      <nux-button type="success" @click="onConfirmClick">confirm按钮</nux-button>
      <nux-button type="warn" @click="onLoadingClick">loading按钮</nux-button>
      <h3>{{'abcdef' | capitalize}}</h3>
      <!-- <p v-base-directive:foo.a.b="baseData">base</p> -->
      <span>icon:</span>
      <nux-icon type="check" style="color:blue;font-weight:bold;font-size:50px;"></nux-icon>
      <nux-leftslip ref="demo1">
        <div slot="slip-main" class="slip-main">向左滑动我</div>
        <div slot="slipbtns" class="slipbtns">
          <a href="javascript:;" @click="delSlipItem">删除</a>
          <a href="javascript:;" style="background:#cccccc;">收藏</a>
        </div>
      </nux-leftslip>
      <br>
      <Draggable></Draggable>
      <br>
      <nux-button type="primary" @click="onSelectCity">城市选择</nux-button>
      <span>{{city}}</span>
    </div>
  </div>
</template>

<script>
import Draggable from './draggable'
import { shuffleJson } from '../../../common/util'
export default {
  name: 'home',
  data() {
    return {
      show: true,
      baseData: 'v-base',
      city: '',
      cityList: {
        'E': ['北京1', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'B': ['北京2', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'A': ['北京3', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'C': ['北京4', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'D': ['北京5', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'F': ['北京6', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'G': ['北京7', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'H': ['北京8', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'I': ['北京9', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'J': ['北京10', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'Z': ['北京11', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        'Y': ['北京12', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都']
      },
    }
  },
  components: {
    Draggable
  },
  mounted() {
    
  },
  methods: {
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
    },
    // 城市选择
    onSelectCity() {
      let vm = this.$selectCity({
        currentCity: '沈阳',
        hotCityList: ['北京', '上海', '广州', '深圳', '天津', '重庆', '武汉', '长沙', '厦门', '杭州', '南京', '成都'],
        cityList: this.cityList,
        searchHandler: res=> {
          // 注意这里，想要动态改变组件的prop，使用此方式
          vm.cityList = shuffleJson(this.cityList); 
        },
        callBack: res=> {
          this.city = res;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 14px;
}
.home-div {
  width: 375px;
  height: 20px;
  background: red;
}
</style>
