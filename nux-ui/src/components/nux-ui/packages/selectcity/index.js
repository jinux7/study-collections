import SelectCity from './selectcity.vue';

SelectCity.install = function (Vue) {
  Vue.prototype.$selectCity = function (options={}) {
    let NewCom = new Vue(Object.assign({}, SelectCity, {
      propsData: {
        currentCity: options.currentCity || null,
        hotCityList: options.hotCityList || null,
        cityList: options.cityList || null,
        searchHandler: options.searchHandler || function() {},
        callBack: options.callBack || function() {}
      }
    }))
    document.body.appendChild(NewCom.$mount().$el)
    return NewCom;
  }
}
export default SelectCity