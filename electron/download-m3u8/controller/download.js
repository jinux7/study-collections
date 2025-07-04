import { ipcMain } from 'electron';
import { dialog } from 'electron';
import { win as mainWindow } from '../main.js';
import axios from 'axios';
import m3u8Parser from 'm3u8-parser';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

// 获取命令行参数
// link是视频源m3u8地址
let link = '';
const CONCURRENCY = 10; 
const TEMPFOLDER = './temp';
const OUTPUTFILENAME = 'dlVideo.mp4';
const TIMEOUT = 5000;
let outputPathName = '';
let downloadPercentStr = '0%';  
function main(argLink, argPathName) {
  link = argLink || "https://bfikuncdn.com/20221003/kjiD5eY3/2000kb/hls/index.m3u8";
  outputPathName = argPathName || path.join('./', OUTPUTFILENAME);
  axios.get(link).then(async (response) => {
    // 1. 获取m3u8文件信息
    let data = response.data;
    // 2. 解析文件，形成序列化的列表
    let segments = generateM3u8Segments(data);
    // 下载视频文件
    await downLoadTs(segments);
    // 创建fileList.txt文件
    createFileList(segments);
    // 合并ts文件转成mp4
    await combinFiles();
    // 清除ts文件
    clearTempFiles();
    // 下载完成
    mainWindow.webContents.send('on-download-callback-event', {
      type: 'success'
    });
  }).catch(error=> {
    // 错误处理
    mainWindow.webContents.send('on-download-callback-event', {
      type: 'error',
      message: error.message
    });
  });
}
function generateM3u8Segments(data) {
  console.log('视频地址解析中');
  mainWindow.webContents.send('on-download-callback-event', {
    type: 'parse'
  });
  const parser = new m3u8Parser.Parser();
  parser.push(data);
  parser.end();
  const parsedManifest = parser.manifest;
  const segments = parsedManifest.segments;
  console.log('视频地址解析完成，开始下载\n');
  return segments;
}
async function downLoadTs(segments) {
	return new Promise(async (resolve, reject) => {
		try {
			const concurrencyArr = [];
			for (let i = 0; i<segments.length; i+=CONCURRENCY) {
				concurrencyArr.push(segments.slice(i, i + CONCURRENCY));
			}
			for(let i=0; i<concurrencyArr.length; i++) {
				const arr = concurrencyArr[i].map(item=> {
					return axios({
						url: item.uri,
						method: 'get',
						timeout: TIMEOUT,
						responseType: 'arraybuffer' // 下载文件时需要将返回数据改为arraybuffer类型
					});
				});
				const result = await Promise.allSettled(arr);
				for(let j=0; j<result.length; j++) {
					const item = result[j];
					if(item.status === 'fulfilled') {
						const buffer = item.value.data;
						const fileName = path.resolve(TEMPFOLDER, segments[CONCURRENCY*i + j].uri.split('\/').pop());
						segments[CONCURRENCY*i + j].bSuccess = true;
						segments[CONCURRENCY*i + j].fileName = segments[CONCURRENCY*i + j].uri.split('\/').pop();
						if(!fs.existsSync(path.resolve(TEMPFOLDER))) {
							fs.mkdirSync(path.resolve(TEMPFOLDER));
						}
						fs.writeFileSync(fileName, buffer);
					}else {
						segments[CONCURRENCY*i + j].bSuccess = false;
					}
          downloadPercentStr = Math.ceil((CONCURRENCY*i + j)/segments.length*100);
          mainWindow.webContents.send('on-download-callback-event', {
            type: 'process',
            value: downloadPercentStr
          });
				}
			}
			// 下载成功
			resolve();
		}catch(err) {
			console.error('下载报错：' + err);
		}
		
	});
}
function createFileList(segments) {
	const arr = segments.filter(item=> item.bSuccess);
	const content = arr.map(item=> `file ${item.fileName}`).join('\n') + '\n';
	fs.writeFile(path.resolve(TEMPFOLDER, 'fileList.txt'), content, 'utf8', (err) => {
		if (err) {
			console.error('fileList.txt创建失败:', err);
		} else {
			console.log('fileList.txt创建写入成功');
		}
	});
}
function combinFiles() {
  return new Promise((resolve, reject) => {
    ffmpeg()
    .input(path.resolve(TEMPFOLDER, 'fileList.txt')) // 使用 fileList.txt
    .inputFormat('concat')        // 指定输入格式为 concat（FFmpeg 的拼接模式）
    .videoCodec('copy')           // 视频流直接复制（不重新编码）
    .audioCodec('copy')           // 音频流直接复制（不重新编码）
    .format('mp4')                // 输出格式为 mp4
    .on('start', (command) => {
      console.log('视频合并开始');
      console.log('FFmpeg 命令启动:', command);
      mainWindow.webContents.send('on-download-callback-event', {
        type: 'combinStart'
      });
    })
    .on('progress', (progress) => {
      // console.log(`进度: ${progress.percent || 0}%\r`);
    })
    .on('end', ()=> {
      console.log('视频合并完成！输出文件:', OUTPUTFILENAME);
      mainWindow.webContents.send('on-download-callback-event', {
        type: 'combinEnd'
      });
      resolve();
    })
    .on('error', (err) => {
      console.error('合并出错:', err.message);
    })
    .save(path.resolve(outputPathName)); 
  });
}
function clearTempFiles() {
  const folderPath = path.resolve('./', TEMPFOLDER);
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
        throw err;
    }
    console.log(`${folderPath} 已被删除`);
  });
}

ipcMain.handle('on-download-event', (e, str)=> {
  const data = JSON.parse(str);
  const output = path.resolve(data.path, data.fileName+'.mp4');
  console.log(output);
  main(data.url, output);  
});