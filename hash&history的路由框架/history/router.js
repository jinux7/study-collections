var loop = function() {};
var routerDestroyCallback = loop; // 路由销毁回调函数存储  
// history前进后退添加事件
window.onpopstate = function (e) {
  const historyName = e.state && e.state.name || '';
  let urlObj = router.filter(item=> {
    return item.name === historyName; 
  });
  historyName && fetchFileWrap(urlObj[0]);
}
window.addEventListener('load', function(ev) {
  pageDirect(router[0]);
});
// 禁止掉a标签的默认跳转
document.addEventListener('click', e => {
  if(e.target.tagName !== 'A') return;
  e.preventDefault();
  const href = e.target.getAttribute('href');
  if(!href) return;
  const historyName = href.split('/').pop();
  urlObj = router.filter(item=> {
    return item.name === historyName; 
  });
  if(urlObj.length===0) {
    urlObj = router;
  }
  pageDirect(urlObj[0]);
});
// 页面跳转
function pageDirect(obj) {
  window.history.pushState({ name: obj.name }, null , obj.name);
  fetchFileWrap(obj);
}
// fetchFile上层再次封装
function fetchFileWrap(obj) {
  fetchFile('#app', obj.fileAddress, function() {
    routerDestroyCallback&&routerDestroyCallback(); // 执行上一个路由的destroyed函数
    routerDestroyCallback = obj.destroyed || loop; // 将当前路由的destroyed函数挂载
    obj.mounted&&obj.mounted(); // 执行当前路由的mounted函数
  });
}
/**
 * @description 页面的路由配置
 * @field { name } hash的名字
 * @field { fileAddress } 页面的相对于index.html的文件路径
 * @function { mounted } 页面加载后调用
 * @function { destroyed } 页面销毁后调用
 */
const router = [
  { // 第一个路由是默认路由
    name: 'home',
    fileAddress: './src/home.html',
    mounted: function() { console.log('home mounted'); },
    destroyed: function() { console.log('home destroyed'); }
  },
  {
    name: 'a',
    fileAddress: './src/a.html',
    mounted: function() { console.log('a mounted'); },
    destroyed: function() { 
      console.log('a destroyed');
      clearInterval(timer_a);
    }
  },
  {
    name: 'b',
    fileAddress: './src/b.html',
    mounted: function() { console.log('b mounted'); },
    destroyed: function() { console.log('b destroyed'); }
  },
  {
    name: 'c',
    fileAddress: './src/c.html',
    mounted: function() { console.log('c mounted'); },
    destroyed: function() { console.log('c destroyed'); }
  }
]