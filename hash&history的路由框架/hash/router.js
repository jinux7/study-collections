var loop = function() {};
var routerDestroyCallback = loop; // 路由销毁回调函数存储  
const handleRouter = e => {
  const newURL = e && e.newURL || window.location.href;
  var urlObj;
  const newHash = newURL.split('#').pop();
  urlObj = router.filter(item=> {
    return item.name === newHash; 
  });
  if(urlObj.length===0) {
    urlObj = router;
  }
  fetchFile('#app', urlObj[0].fileAddress, function() {
    routerDestroyCallback&&routerDestroyCallback(); // 执行上一个路由的destroyed函数
    routerDestroyCallback = urlObj[0].destroyed || loop; // 将当前路由的destroyed函数挂载
    urlObj[0].mounted&&urlObj[0].mounted(); // 执行当前路由的mounted函数
  });
};
window.addEventListener('hashchange', handleRouter);
window.addEventListener('load', function(ev) {
  window.location.hash = router[0].name;
  handleRouter(ev);
});
// 禁止掉a标签的默认跳转
document.addEventListener('click', e => {
  if(e.target.tagName !== 'A') return;
  e.preventDefault();
  const href = e.target.getAttribute('href');
  if(!href) return;
  const hashName = href.split('/').pop();
  changeHash(hashName);
});
// 更改url的hashName
function changeHash(hashName) {
  window.location.hash = hashName;
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