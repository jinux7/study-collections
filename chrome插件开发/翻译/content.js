class TranslationHelper {
  constructor() {
    this.init();
  }
  
  init() {
    this.createTranslateButton();
    this.bindEvents();
  }
  
  createTranslateButton() {
    this.button = document.createElement('div');
    this.button.id = 'translate-btn';
    this.button.innerHTML = '翻译';
    this.button.style.cssText = `
      position: absolute;
      background: #6CB2C8;
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      z-index: 10000;
      display: none;
    `;
    document.body.appendChild(this.button);
  }
  
  bindEvents() {
    document.addEventListener('mouseup', (e) => {
      this.handleTextSelection(e);
    });
    document.addEventListener('click', (e) => {
      window.getSelection().removeAllRanges();
      if(this.bCloseable&&this.resultBox) {
        document.body.removeChild(this.resultBox);
        this.resultBox = null;
      }
    });
  }
  
  handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText.length>0&&!this.resultBox) {
      this.showButton(e.pageX, e.pageY);
      this.selectedText = selectedText;
      this.translateSelectedText();
    } else {
      this.hideButton();
    }
  }
  
  showButton(x, y) {
    this.button.style.left = x + 'px';
    this.button.style.top = (y - 40) + 'px';
    this.button.style.display = 'block';
  }
  
  hideButton() {
    this.button.style.display = 'none';
  }
  
  async translateSelectedText() {
    if (!this.selectedText) return;
    try {
      this.button.innerHTML = '翻译中...';
      const result = await this.callTranslateAPI(this.selectedText);
      this.showTranslationResult(result);
    } catch (error) {
      console.error('翻译失败:', error);
      this.button.innerHTML = '翻译失败';
    }
  }
  
  async callTranslateAPI(text) {
    // 这里使用免费的翻译API示例
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh`);
    const data = await response.json();
    return data.responseData.translatedText;
  }
  
  showTranslationResult(translatedText) {
    if(this.resultBox) {
      document.body.removeChild(this.resultBox);
      this.resultBox = null;
      return ;
    }
    // 创建结果显示框
    const resultBox = document.createElement('div');
    this.resultBox = resultBox;
    resultBox.style.cssText = `
      position: absolute;
      background: white;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 1px 1px 8px 1px #6CB2C8;
      min-width: 200px;
      max-width: 500px;
      z-index: 10001;
    `;
    
    resultBox.innerHTML = `
      <div style="margin-bottom: 5px;">翻译结果：</div>
      <div>${translatedText}</div>
      <div style="text-align: right; margin-top: 5px;">
        <button id="resultBoxCloseBtn" style="font-size:12px;padding:3px 15px;border-radius:30px;border:1px solid #ddd;background:#f5f5f5;">
          关闭
        </button>
      </div>
    `;
    // 定位结果框
    resultBox.style.left = this.button.offsetLeft + 'px';
    resultBox.style.top = (this.button.offsetTop + 30) + 'px';
    document.body.appendChild(resultBox);
    this.hideButton();
    this.bCloseable = false;
    setTimeout(() => {
      this.bCloseable = true;
    }, 1000);
  }
}

// 初始化翻译助手
new TranslationHelper();
