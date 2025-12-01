# Blog 包文件复制说明

## 📋 需要复制的文件和目录

### 1. 核心文件（必须）

从 `src/pages/Blog/` 复制以下内容到 `blog-package/src/pages/Blog/`：

```
src/pages/Blog/
├── BlogHome.jsx
├── ArticlePage.jsx
├── BlogLayout.jsx
├── components/
│   ├── CategoryGrid.jsx
│   ├── CTASection.jsx
│   ├── HeroSection.jsx
│   ├── LoadingScreen.jsx
│   └── TimelineSection.jsx
├── css/
│   ├── CategoryGrid.css
│   └── TimelineSection.css
├── hooks/
│   └── useImagePreloader.js
└── images/
    ├── article-images/
    │   ├── article-1.jpg
    │   ├── article-2.jpg
    │   ├── article-3.jpg
    │   ├── article-4.jpg
    │   ├── article-5.jpg
    │   └── article-6.jpg
    └── phase-images/
        ├── phase-1.jpg
        ├── phase-2.jpg
        ├── phase-3.jpg
        ├── phase-4.jpg
        ├── phase-5.jpg
        └── phase-6.jpg
```

### 2. 数据文件（必须）

从 `src/data/blogData.json` 复制到 `blog-package/src/data/blogData.json`

### 3. 样式文件（必须）

需要创建 `blog-package/src/index.css`，包含 Tailwind CSS 基础样式：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 静态资源（必须）

从 `public/jobgenLogo.png` 复制到 `blog-package/public/jobgenLogo.png`

## 🔧 修改步骤

### 步骤 1: 创建目录结构

```bash
mkdir -p blog-package/src/pages/Blog
mkdir -p blog-package/src/data
mkdir -p blog-package/public
```

### 步骤 2: 复制文件

使用以下命令或手动复制：

```bash
# 复制 Blog 页面文件
cp -r src/pages/Blog/* blog-package/src/pages/Blog/

# 复制数据文件
cp src/data/blogData.json blog-package/src/data/

# 复制 Logo
cp public/jobgenLogo.png blog-package/public/
```

### 步骤 3: 修改导入路径

在复制的文件中，需要修改以下导入路径：

#### BlogHome.jsx
- 确保所有相对路径正确

#### ArticlePage.jsx
- 修改 `blogData` 导入路径：
  ```jsx
  // 从
  import blogData from '../../data/blogData.json';
  // 改为（如果路径不同）
  import blogData from '../../../data/blogData.json';
  ```

#### BlogLayout.jsx
- 检查 Logo 路径是否正确

### 步骤 4: 创建 Tailwind 配置

创建 `blog-package/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### 步骤 5: 创建 PostCSS 配置

创建 `blog-package/postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 步骤 6: 安装依赖

```bash
cd blog-package
npm install
```

### 步骤 7: 运行

```bash
npm run dev
```

## ⚠️ 注意事项

1. **路径问题**: 确保所有相对路径在新结构中正确
2. **图片路径**: 如果图片路径改变，需要更新所有引用
3. **数据路径**: 确保 `blogData.json` 的导入路径正确
4. **样式**: 确保 Tailwind CSS 配置正确
5. **路由**: 如果集成到其他项目，需要调整路由配置

## 🔍 验证清单

- [ ] 所有文件已复制
- [ ] 导入路径已更新
- [ ] Tailwind CSS 已配置
- [ ] 依赖已安装
- [ ] 应用可以正常启动
- [ ] 路由正常工作
- [ ] 图片正常显示
- [ ] 样式正常渲染

