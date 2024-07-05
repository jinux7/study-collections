const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const packagesRoot = './packages';
const packageName = 'package.json';
let version;
// 获取主项目package.json中的version
let packageData = fs.readFileSync(path.resolve('./', packageName), 'utf8');
version = JSON.parse(packageData).version;
// 发布的命令行执行函数
function publishPackage(packageDir) {
    exec(`cd ${packageDir} && pnpm publish`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error publishing ${packageDir}:`, error);
      } else {
        console.log(`Published: ${packageDir}`);
      }
  });
}
// 扫描子项目函数
function scanAndPublish(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      if (file.isDirectory()) {
        // 修改package.json中的version
        let packagePath = path.resolve('./', packagesRoot, file.name, packageName);
        let packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        packageData.version = version;
        let writeData = JSON.stringify(packageData, null, 2);
        fs.writeFileSync(packagePath, writeData, 'utf8');
        // 发布
        publishPackage(path.dirname(packagePath));
      }
    });
  });
}

// 主入口
scanAndPublish(packagesRoot);