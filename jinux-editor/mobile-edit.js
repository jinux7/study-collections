(function(win, doc) {
  var MobileEdit;
  win.MobileEdit = MobileEdit = function(option) {
    var self = this;
    var defaultOptioin = {
      width: 375,
      height: 667
    };
    this.option = Object.assign(defaultOptioin, option);

    var nEditBox = document.querySelector('#'+option.id);
    // 创建一个div editor编辑框
    var nEditor = doc.createElement('DIV'); 
    // 创建工具bar
    var nToolBar = doc.createElement('DIV');
    // 设置editor
    nEditor.setAttribute('id', 'jinuxEditor');
    nEditor.setAttribute('contenteditable', 'true');
    nEditor.style.width = parseInt(this.option.width) + 'px';
    nEditor.style.height = parseInt(this.option.height)-32 + 'px';
    // 设置toolbar
    nToolBar.setAttribute('id', 'jinuxToolBar');
    nToolBar.style.width = parseInt(this.option.width) + 'px';
    nToolBar.style.height = '32px';
    // 工具栏html代码片段
    var nToolBarItems = `
                        <div class="back icon"></div>
                        <div class="forward icon"></div>
                        <div class="fontSize icon">
                          <div class="fontPanel">
                            <ul>
                              <li data-fontsize="1">H1</li>
                              <li data-fontsize="2">H2</li>
                              <li data-fontsize="3">H3</li>
                              <li data-fontsize="4">H4</li>
                              <li data-fontsize="5">H5</li>
                              <li data-fontsize="6">H6</li>
                              <li data-fontsize="7">H7</li>
                            </ul>
                          </div>
                        </div>
                        <div class="bold icon"></div>
                        <div class="left icon"></div>
                        <div class="center icon"></div>
                        <div class="right icon"></div>
                        <div class="upimage icon">
                          <input id="uploadImg" type="file" accept="image/gif,image/jpeg,image/png" />
                        </div>
                        `;
    nToolBar.innerHTML = nToolBarItems;

    // 插入节点
    nEditBox.appendChild(nToolBar);
    nEditBox.appendChild(nEditor);

    // 初始化编辑内容
    // (document.getElementById('jinuxEditor')).innerHTML = this.option.initContent;
    document.getElementById('jinuxEditor').focus();
    document.execCommand('insertText', false, this.option.initContent);
    self.option.getContent(this.option.initContent);


    // 给editor添加input事件
    nEditor.addEventListener('input', function(ev) {
      self.option.getContent(ev.target.innerHTML);
      // console.log(ev.target.innerHTML);
    }, false);

    // toolBar点击按钮加事件
    var nIconItems = nToolBar.querySelectorAll('.icon');
    nIconItems.forEach(function(item) {
      item.addEventListener('click', function(ev) {
        var aClassNames = Array.from(ev.target.classList);
        // 操作回退
        if(aClassNames.indexOf('back')>-1) {
          document.execCommand('undo', false);
        // 操作前进  
        }else if(aClassNames.indexOf('forward')>-1) {
          document.execCommand('redo', false);
        // 字体大小  
        }else if(aClassNames.indexOf('fontSize')>-1) {
          var targetNode = ev.target;
          var nFontPanel = targetNode.querySelector('.fontPanel');
          if(!targetNode.dataset.bshow) {
            targetNode.dataset.bshow = 'show'
            nFontPanel.style.display = 'block';
          }else {
            targetNode.dataset.bshow = ''
            nFontPanel.style.display = 'none';
          }
        //  字体加粗
        }else if(aClassNames.indexOf('bold')>-1) {
          if(document.queryCommandState('bold')===false) {
            ev.target.classList.add('active');
            document.execCommand("bold",false,null);
          }else {
            ev.target.classList.remove('active');
            document.execCommand("bold",false,null);
          }
        // 左对齐  
        }else if(aClassNames.indexOf('left')>-1) {
          document.execCommand('justifyLeft', false);
        // 中间对齐  
        }else if(aClassNames.indexOf('center')>-1) {
          document.execCommand('justifyCenter', false);
        // 右对齐
        }else if(aClassNames.indexOf('right')>-1) {
          document.execCommand('justifyRight', false);
        // 图片上传   
        }else if(aClassNames.indexOf('upimage')>-1) {
          document.getElementById('uploadImg').click();
        }                         
      }, false);
    });

    // 字体大小添加事件
    var nFontSize = nToolBar.querySelector('.fontSize.icon');
    nFontSize.addEventListener('click', function(ev) {
      var targetNode = ev.target,
          sizeNum;
      if(sizeNum = targetNode.dataset.fontsize) {
        // console.log(this,98);
        this.dataset.bshow = '';
        this.querySelector('.fontPanel').style.display = 'none';
        document.execCommand('fontSize', false, sizeNum);
      }
    }, false);

    // 上传文件添加变化事件
    document.getElementById('uploadImg').addEventListener('change', function(ev) {
      self.option.uploadImg(this.files, function(url) {
        document.execCommand('insertImage', false, url);
      });
      console.log(this.files); 
    }, false);    

  }

})(window, document)