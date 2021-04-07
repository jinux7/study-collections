<template>
  <div id="select-city-modal">
    <div class="content">
      <div class="close-box" >
        <nux-icon type="roundclosefill" class="icon" @click.native="destroyComponent"></nux-icon>
      </div>
      <div class="search-box">
        <nux-icon type="search" class="icon"></nux-icon>
        <span></span>
        <input v-model="searchCity" type="text" placeholder="输入城市名称" @input="onSearch">
      </div>
      <div id="city-wrap" class="city-wrap">
        <div class="current-city" name="scroll-current">
          <p>当前城市</p>
          <div>
            <strong @click="onYes(currentCity)">{{currentCity?currentCity:'未获取到当前城市'}}</strong>
            <!-- <span>GPS定位</span> -->
          </div>
        </div>
        <div class="hot-city" name="scroll-hot">
          <p>热门站点</p>
          <ul>
            <li @click="onYes(item)" v-for="(item,index) in hotCityList" :key="index">
              <span>{{item}}</span>
            </li>
          </ul>
        </div>
        <div class="city-list">
          <div v-for="(item1, key) in cityList" :key="key" :name="'scroll-'+key">
            <h3>{{key}}</h3>
            <ul>
              <li v-for="(item2, index) in item1" :key="index" @click="onYes(item2)">
                {{item2}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-bar">
      <ul>
        <li name="current" @click="onScrollTo">当前</li>
        <li name="hot" @click="onScrollTo">热门</li>
        <li v-for="(item, index) in scrollBarList" :key="index" :name="item" @click="onScrollTo">
          {{item}}
        </li>
      </ul>    
    </div>
  </div>
</template>

<script>
// import { travelpolicyListCity } from '../api'
// import { getStyleVal } from '@config/mUtils'
  export default {
    name: 'app',
    data () {
      return {
        searchCity: '', // input搜索
        timer: null,
      }
    },
    props: ['currentCity', 'hotCityList', 'cityList', 'searchHandler', 'callBack'],
    directives: {      
    },
    components: {
    },
    computed: {
      scrollBarList() {
        return Object.keys(this.cityList);
      }
    },
    created() {
    },
    destroyed() {
    },
    mounted() {
      // console.log(this.cityList, 998);
      setTimeout(()=> {
        this.setListHeight();
      }, 100);
    },
    methods: {
      // 搜索
      onSearch() {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=> {
          this.searchHandler(this.searchCity);
          document.getElementById('city-wrap').scrollTo(0, 0);
        }, 1000);
      },
      // 获取city数据
      getData(params) {
        return travelpolicyListCity(params)
      },
      onYes(da) {
        this.destroyComponent();
        this.callBack(da);
      },
      destroyComponent() {
        document.body.removeChild(this.$el);
      },
      // 将城市列表数据转化
      changeCityData(obj) {
        let newObj = {};
        for(let key in obj) {
          obj[key].forEach(item => {
            newObj[item.name] = item.code;
          });
        }
        return newObj;
      },
      // 页面滚动
      onScrollTo(evt) {
        let nCityWrap = document.querySelector('#city-wrap'); 
        let name = evt.target.getAttribute('name');
        let ele = document.querySelector('[name=scroll-'+name+']');
        let topNum = ele.offsetTop;
        let currentTopNum = nCityWrap.scrollTop;
        let g = (topNum - currentTopNum)/10;
        if(topNum>currentTopNum) {
          let timer = setInterval(() => {
            currentTopNum += g;
            if(currentTopNum >= topNum) {
              clearInterval(timer);
              nCityWrap.scrollTo(0, topNum);
            }else {
              nCityWrap.scrollTo(0, currentTopNum);
            }
          }, 10);
        }else {
          let timer = setInterval(() => {
            currentTopNum += g;
            if(currentTopNum <= topNum) {
              clearInterval(timer);
              nCityWrap.scrollTo(0, topNum);
            }else {
              nCityWrap.scrollTo(0, currentTopNum);
            }
          }, 10);
        }
        // console.log(topNum);
      },
      // 设置城市列表高度
      setListHeight() {
        let nSearch = document.querySelector('.search-box');
        let clientHeight = document.documentElement.clientHeight;
        let searchHeight = parseFloat(getStyleVal(nSearch, 'height')) 
            + parseFloat(getStyleVal(nSearch, 'marginTop'))
            + parseFloat(getStyleVal(nSearch, 'marginBottom'));
        document.querySelector('.city-wrap').style.height = 
        clientHeight - searchHeight + 'px';
      },
    },
    watch: {
    }
  }
  const getStyleVal = (element, attr)=> {
    var computed;
    if(element.currentStyle) {
      computed = element.currentStyle;
    } else {
      computed = window.getComputedStyle(element, false);
    }
    return computed.getPropertyValue( attr ) || computed[ attr ];
  }
</script>

<style scoped  lang="scss">
#select-city-modal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;  
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .close-box {
    padding: 0;
    text-align: right;
    .icon {
      font-size: 22px;
      position: relative;
      color: rgb(141, 138, 138);
      top: 2px;
      right:3px;
    }
  }
  .search-box {
    margin: 0 auto 0;
    width: 342px;
    height: 35px;
    background-color: #f0eff4;
    border-radius: 35px;
    display: flex;
    align-items: center;
    .icon {
      width: 30px;
      fill: #b2b2b2;
      margin: 0 0px 0 15px;
    }
    span {
      height: 15px;
      width: 1px;
      background-color: #dddddd;
      margin-right: 5px;
    }
    input {
      height: 30px;
      line-height: 30px;
      background-color: transparent;
      width: 230px;
      margin-left: 5px;
      outline: none;
      border: none;
    }
  }
  .city-wrap {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    .current-city {
      margin: 10px 26px 0;
      p {
        font-size: 13px;
        color: #717171;
      }
      div {
        margin-top: 10px;
        strong {
          font-size: 16px;
        }
        span {
          font-size: 13px;
          color: #717171;
          margin-left: 5px;
        }
      }
    }
    .hot-city {
      margin: 10px 26px 0;
      p {
        font-size: 13px;
        color: #717171;
      }
      ul {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        li {
          font-size: 14px;
          width: 30%;
          margin-right: 3%;
          margin-bottom: 5px;
          border: 1px solid #b5b5b5;
          height: 35px;
          line-height: 35px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
    .city-list {
      margin: 10px 26px 0 0;
      > div {
        h3 {
          padding-left: 26px;
          color: #4593ff;
          font-size: 16px;
          height: 36px;
          line-height: 36px;
          background-color: #ddeafb;
        }
        ul {
          padding-left: 10px;
          font-size: 14px;
          li {
            padding-left: 16px;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #e7e7e7;
          }
        }
      }
    }
  }
  .scroll-bar {
    position: absolute;
    top: 10%;
    right: 2px;
    // transform: translateY(-50%);
    font-size: 14px;
    color: #4593ff;
    ul {
      li {
        margin: 5px 0;
        text-align: center;
      }
    }
  }
}
</style>