// 监听扩展图标被点击的事件
chrome.action.onClicked.addListener(async (tab) => {
  // 例如：可以在这里执行一些后台操作
  console.log('插件图标被点击了！当前标签页:', tab.url);
  // 也可以向内容脚本发送消息
  // chrome.tabs.sendMessage(tab.id, {action: "doSomething"});
});

// 监听来自 content script 或 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    // 执行一些后台逻辑
    const data = "来自后台的数据";
    sendResponse({data: data});
  }
  // 如果使用 sendResponse，需要返回 true（异步情况下）
  return true;
});