// 监听来自 popup 或 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "changeColor") {
    // 改变页面背景色
    document.body.style.backgroundColor = request.color;
    // 可以发送响应（如果需要）
    // sendResponse({status: "success"});
  }
});