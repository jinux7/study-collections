import './style.css';
import Hls from 'hls.js';
var video = document.getElementById('video');
var videoList = ['video1', 'video2', 'video3', 'video4', 'video5'];
// 创建buttons并插入dom
var nUl = document.querySelector('.video-list ul');
videoList.forEach(item=> {
  var nLi= document.createElement('li');
  var nBtn= document.createElement('button');
  nBtn.textContent = item;
  nLi.appendChild(nBtn);
  nUl.appendChild(nLi);
});

playVideo(videoList[0]);

// 按钮添加事件
var buttons = document.querySelectorAll('.video-list button');
for(let btn of buttons) {
  btn.onclick = (evt)=> {
    let videoName = evt.target.textContent;
    playVideo(videoName);
  }
}
// 播放video
function playVideo(videoName) {
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource('http://127.0.0.1:3000/'+videoName+'.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      // video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = 'http://127.0.0.1:3000/'+videoName+'.m3u8';
    video.addEventListener('loadedmetadata', function () {
      // video.play();
    });
  }
}
