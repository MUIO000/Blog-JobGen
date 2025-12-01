# JobGen Blog Package

独立的 Blog 模块包，可以单独使用或集成到其他项目中。

## 📦 包结构

```
blog-package/
├── src/
│   ├── pages/
│   │   └── Blog/
│   │       ├── BlogHome.jsx          # 博客首页
│   │       ├── ArticlePage.jsx       # 文章详情页
│   │       ├── BlogLayout.jsx       # 博客布局组件
│   │       ├── components/          # 组件目录
│   │       ├── css/                 # 样式文件
│   │       ├── hooks/               # 自定义 Hooks
│   │       └── images/              # 图片资源
│   └── data/
│       └── blogData.json            # 博客数据
├── index.js                         # 入口文件
├── package.json
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

## 📖 使用方法

### 方式一：作为独立应用

在 `index.js` 中已经配置了完整的路由和应用入口：

```jsx
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 方式二：集成到现有项目

#### 1. 复制文件到你的项目

将 `blog-package/src` 目录下的所有文件复制到你的项目中。

#### 2. 安装依赖

确保你的项目已安装以下依赖：

```bash
npm install framer-motion lucide-react react-markdown @tailwindcss/typography
```

#### 3. 配置路由

在你的路由配置中添加：

```jsx
import { Routes, Route } from 'react-router-dom';
import BlogHome from './pages/Blog/BlogHome';
import ArticlePage from './pages/Blog/ArticlePage';

function App() {
  return (
    <Routes>
      <Route path="/blog" element={<BlogHome />} />
      <Route path="/blog/article/:articleId" element={<ArticlePage />} />
      {/* 其他路由... */}
    </Routes>
  );
}
```

#### 4. 配置 Tailwind CSS

确保你的 `tailwind.config.js` 包含：

```js
module.exports = {
  content: [
    './src/pages/Blog/**/*.{js,jsx}',
    // 其他路径...
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

#### 5. 复制数据文件

将 `blogData.json` 复制到你的项目中，并确保路径正确。

#### 6. 复制图片资源

将 `images` 目录下的所有图片复制到你的 `public` 目录或相应的静态资源目录。

## 🔧 配置选项

### 自定义 Logo

在 `BlogLayout.jsx` 中修改 Logo 路径：

```jsx
<img src="/your-logo.png" alt="Logo" />
```

### 自定义链接

在 `BlogLayout.jsx` 中修改导航链接：

```jsx
<Link to="/your-home-path">Home</Link>
```

### 自定义数据源

修改 `blogData.json` 的导入路径，或使用 API 获取数据：

```jsx
// 在 BlogHome.jsx 或 ArticlePage.jsx 中
import blogData from './path/to/blogData.json';
// 或
const blogData = await fetch('/api/blog').then(r => r.json());
```

## 📝 数据格式

`blogData.json` 应包含以下结构：

```json
{
  "categories": [...],
  "timeline": [...],
  "articles": [...]
}
```

详细格式请参考 `src/data/blogData.json`。

## 🎨 样式

本包使用 Tailwind CSS，确保你的项目已正确配置 Tailwind。

## 📦 导出组件

包提供了以下导出：

- `BlogHome` - 博客首页组件
- `ArticlePage` - 文章详情页组件
- `BlogLayout` - 博客布局组件

## 🔗 依赖关系

- React 18+ 或 19+
- React Router DOM 6+ 或 7+
- Framer Motion
- Lucide React
- React Markdown
- Tailwind CSS

## 📄 许可证

与主项目保持一致。

