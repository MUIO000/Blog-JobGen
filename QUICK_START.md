# 🚀 Blog 包快速开始指南

## 方式一：使用复制脚本（推荐）

### 1. 运行复制脚本

```bash
cd blog-package
node copy-files.js
```

脚本会自动从主项目复制所有必要的文件。

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 方式二：手动复制

### 1. 创建目录结构

```bash
mkdir -p blog-package/src/pages/Blog
mkdir -p blog-package/src/data
mkdir -p blog-package/public
```

### 2. 复制文件

```bash
# Windows (PowerShell)
Copy-Item -Recurse -Force ..\src\pages\Blog\* .\src\pages\Blog\
Copy-Item -Force ..\src\data\blogData.json .\src\data\
Copy-Item -Force ..\public\jobgenLogo.png .\public\

# Linux/Mac
cp -r ../src/pages/Blog/* ./src/pages/Blog/
cp ../src/data/blogData.json ./src/data/
cp ../public/jobgenLogo.png ./public/
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 📋 验证清单

复制完成后，检查以下文件是否存在：

- [ ] `src/pages/Blog/BlogHome.jsx`
- [ ] `src/pages/Blog/ArticlePage.jsx`
- [ ] `src/pages/Blog/BlogLayout.jsx`
- [ ] `src/pages/Blog/components/` (所有组件)
- [ ] `src/pages/Blog/css/` (样式文件)
- [ ] `src/pages/Blog/hooks/` (Hooks)
- [ ] `src/pages/Blog/images/` (图片资源)
- [ ] `src/data/blogData.json`
- [ ] `public/jobgenLogo.png`

## 🔧 常见问题

### 问题 1: 导入路径错误

如果遇到导入路径错误，检查以下文件中的相对路径：

- `BlogHome.jsx`
- `ArticlePage.jsx`
- `BlogLayout.jsx`
- 所有组件文件

### 问题 2: 图片无法显示

确保：
1. 图片文件已复制到正确位置
2. Logo 路径在 `BlogLayout.jsx` 中正确

### 问题 3: 样式不生效

确保：
1. `src/index.css` 已创建
2. `main.jsx` 中已导入 `index.css`
3. Tailwind CSS 配置正确

### 问题 4: 数据加载失败

检查 `blogData.json` 的导入路径是否正确。

## 📦 打包发布

如果需要将包发布为 npm 包：

```bash
npm run build
npm publish
```

## 🔗 集成到其他项目

参考 `README.md` 中的"集成到现有项目"部分。

