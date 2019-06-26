#!/usr/bin/env node

// inquirer是一个node命令行下的问答插件
const inquirer = require('inquirer');
// download-git-repo是一个git的下载插件
const download = require('download-git-repo');
// ora是一个命令行的显示等待的插件
const ora = require('ora');
const path = require('path');

const spinner = ora({color: 'yellow'}); // 生成加载效果实例
// 选择列表
const promptList = [{
    type: 'list',
    message: '请选择项目:',
    name: 'project',
    choices: [
        "linkage",
        "bluedog",
    ],
    filter: function (val) { // 使用filter将回答变为小写
        return val.toLowerCase();
    }
}];
// 下载的github的项目信息
const templates = {
    'linkage': {
        url: 'https://github.com/jixoba/provinces_cities_picker',
        downloadUrl: 'https://github.com:jixoba/provinces_cities_picker',
        description: '省市联动'
    },
    'bluedog': {
        url: 'https://github.com/jixoba/bluedog_runrunrun',
        downloadUrl: 'https://github.com:jixoba/bluedog_runrunrun',
        description: '小游戏'
    }
}
// 开始执行命令行显示的内容
inquirer
  .prompt(
    promptList
  )
  .then(answers => {
  	let downloadUrl = templates[answers.project].downloadUrl,
  		  projectName = answers.project;
  	spinner.start(); // 开始等待的显示
  	spinner.text = `正在下载${projectName}项目，请稍等...`;
  	download(downloadUrl, path.resolve(process.cwd(), 'download-projects', projectName), {clone: true}, err => {
            if(err){
                console.log('下载模板出错');
            }else{
                console.log('\r\n下载模板成功');
            }
		        spinner.stop(); // 暂停等待的显示 
        });
  });