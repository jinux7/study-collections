import { exec } from 'child_process';
import { promisify }from 'util';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fse from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// exec转化为async
const execAsync = promisify(exec);
// exec指定工作目录
const options = {
  cwd: resolve(__dirname, '../')
};
// 删除src源代码路径
const removeSrcPath = resolve(__dirname, '../', 'out/godex-printer-win32-x64/resources/app/src');
// 包裹async函数
async function runCommand() {
  try {
    // 封装asar文件
    const res1 = await execAsync('asar pack src src.asar', options);
    // electron-packager打包
    const res2 = await execAsync('electron-packager . godex-printer --platform=win32 --arch=x64 --icon=build/icon.ico --out=out --overwrite', options);
    // 删除打包好的源码文件
    const res3 = await fse.remove(removeSrcPath);
    console.log('执行成功');
  } catch (error) {
    console.error(`执行错误: ${error}`);
  }
}

runCommand();