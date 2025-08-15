// 获取按钮元素
const changeColorButton = document.getElementById('changeColor');

// 当按钮被点击时
changeColorButton.addEventListener('click', async () => {
  // 使用 Chrome 扩展 API 获取当前活动标签页
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  // 向当前标签页发送消息，让 content script 执行操作
  chrome.tabs.sendMessage(tab.id, { action: "changeColor", color: "yellow" });
});