/**
 * 文件复制脚本
 * 用于将 Blog 相关文件从主项目复制到独立包中
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录（假设脚本在 blog-package 目录中）
const projectRoot = path.resolve(__dirname, '..');
const blogPackageRoot = __dirname;

// 需要复制的文件和目录
const filesToCopy = [
  {
    from: 'src/pages/Blog',
    to: 'src/pages/Blog',
    type: 'directory'
  },
  {
    from: 'src/data/blogData.json',
    to: 'src/data/blogData.json',
    type: 'file'
  },
  {
    from: 'public/jobgenLogo.png',
    to: 'public/jobgenLogo.png',
    type: 'file'
  }
];

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  
  // 创建目标目录
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // 复制文件
  fs.copyFileSync(src, dest);
  console.log(`✓ 已复制: ${path.relative(blogPackageRoot, dest)}`);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function main() {
  console.log('🚀 开始复制 Blog 文件...\n');
  
  for (const item of filesToCopy) {
    const srcPath = path.join(projectRoot, item.from);
    const destPath = path.join(blogPackageRoot, item.to);
    
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  源文件不存在: ${srcPath}`);
      continue;
    }
    
    if (item.type === 'directory') {
      console.log(`📁 复制目录: ${item.from}`);
      copyDirectory(srcPath, destPath);
    } else {
      console.log(`📄 复制文件: ${item.from}`);
      copyFile(srcPath, destPath);
    }
  }
  
  console.log('\n✅ 文件复制完成！');
  console.log('\n📝 下一步：');
  console.log('1. 检查复制的文件是否正确');
  console.log('2. 运行 npm install 安装依赖');
  console.log('3. 运行 npm run dev 启动开发服务器');
}

main();

