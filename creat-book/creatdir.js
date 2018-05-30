const fs = require('fs'),
      path = require('path'),
      root = process.cwd();

fs.readdir(root,(err,files)=>{
    if(err){
        console.log('readFile error!!!');
    }
    files.forEach((item)=>{
        console.log(item);
        if(item !== 'creatdir.js'){
            fs.mkdir(root+'/'+item.replace('.md',''),(err)=>{
                if(err){
                    console.log('mkdir error!!!',err);
                }
                // fs.rename(root+'/'+item,root+'/'+'/readme.md',(err)=>{
                //     console.log('移动文件 error');
                // });
                fs.rename(root+'/'+item,root+'/'+item.replace('.md','')+'/'+'readme.md',(err)=>{
                    if(err){
                        console.log('remove file error!!!');
                    }
                });
            });
        }
    });
});