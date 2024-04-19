const fs = require('fs');
const fluentFFmpeg = require('fluent-ffmpeg');
const path = require('path');
// 输入文件夹
const inputFolder = path.resolve(__dirname, './sourceVideos');
// 输入文件夹下的所有视频文件list
const files = fs.readdirSync(inputFolder);

// 输出目录，用于保存生成的 TS 文件和 M3U8 索引文件
const outputDir = path.resolve(__dirname, './public');
// FfmpegCommand实例变量
let command;
// 删除文件夹内容
deleteFolderRecursiveSync(outputDir);
// 循环files文件列表，逐个转换
(async ()=> {
  for(let file of files) {
    // 创建一个 FfmpegCommand 实例
    command = fluentFFmpeg();
    await creatVideos(file);
    console.log('-----完成转换'+file+'-----');
  }
})();

function creatVideos(file) {
  return new Promise((resolve, reject )=> {
    console.log('-----开始转换'+file+'-----');
    const basenameWithExt = path.basename(file);
    const extname = path.extname(basenameWithExt);
    const fileNameWithoutExt = basenameWithExt.slice(0, -extname.length);
    // 设置输出目录和 HLS 参数
    command.input(`${inputFolder}/${file}`)
    .output(`${outputDir}/${fileNameWithoutExt}.m3u8`)
    .outputOptions([
      '-hls_time 10', // 每个切片时长为 10 秒
      '-hls_list_size 0', // 不限制播放列表的大小（无限循环）
      `-hls_segment_filename ${outputDir}/${file}_%03d.ts`, // 指定切片文件命名规则
    ]);

    // 执行转换过程
    command
    .on('progress', function(progress) {
      let per = parseInt(progress.percent || 0);
      console.log('转换进度: ' + per + '%');
    })
    .on('end', () => {
      // console.log('HLS 转换完成！');
      resolve(file);
    })
    .on('error', (err) => {
      console.error('An error occurred: ' + err.message);
    })
    .run();
  });
}
// 删除文件夹内容
function deleteFolderRecursiveSync(folderPath) {
  if (!fs.existsSync(folderPath)) return;

  const files = fs.readdirSync(folderPath);

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(folderPath, files[i]);

    if (fs.lstatSync(filePath).isDirectory()) {
      // 如果是子目录，则递归删除
      deleteFolderRecursiveSync(filePath);
    } else {
      // 如果是文件，则直接删除
      fs.unlinkSync(filePath);
    }
  }
}