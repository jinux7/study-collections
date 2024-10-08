// 发送信息给父窗口
window.onload = function() {
  window.parent.postMessage({
    type: 'loading'
  })
}