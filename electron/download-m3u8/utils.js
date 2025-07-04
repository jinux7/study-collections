import path from 'path';
import { fileURLToPath } from 'url';

export const __dirnameFn = (url)=> {
  // 获取当前模块的 URL
  const __filename = fileURLToPath(url);
  // 从文件名中提取目录名
  // 处理ES MODULE包引入方式没有__filename问题
  const __dirname = path.dirname(__filename);
  return __dirname;
};