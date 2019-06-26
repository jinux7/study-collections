#!/usr/bin/env node

const program = require('commander');
const fse = require('fs-extra');
const path = require('path');

program
  .version('0.1.0')
  .option('-P, --proname <proname>', 'project name')
  .option('-F, --filename <filename>', 'file name')

program
  .command('*')
  .action(function(env){
    // 没有匹配到命令直接打印出help说明
    program.help();
  });
 
program.parse(process.argv);

// 根据命令行的输入新建文件夹及文件名
if(program.proname && program.filename) {
  // 文件夹路径
  let dir = path.resolve(process.cwd(), 'new-projects', program.proname);
  // 文件路径名称
  let file = path.resolve(dir, program.filename) + '.html';
  // 创建文件夹
  fse.ensureDirSync(dir);
  // 创建文件
  fse.ensureFileSync(file);
  fse.outputFile(file, 'hello!');
}