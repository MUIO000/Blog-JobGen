# 📁 Blog 包目录结构

```
blog-package/
├── src/
│   ├── pages/
│   │   └── Blog/
│   │       ├── BlogHome.jsx          # 博客首页组件
│   │       ├── ArticlePage.jsx       # 文章详情页组件
│   │       ├── BlogLayout.jsx        # 博客布局组件（Header + Footer）
│   │       ├── components/           # 子组件目录
│   │       │   ├── CategoryGrid.jsx      # 分类网格组件
│   │       │   ├── CTASection.jsx         # CTA 区域组件
│   │       │   ├── HeroSection.jsx       # 英雄区域组件
│   │       │   ├── LoadingScreen.jsx     # 加载屏幕组件
│   │       │   └── TimelineSection.jsx    # 时间线组件
│   │       ├── css/                  # 样式文件目录
│   │       │   ├── CategoryGrid.css
│   │       │   └── TimelineSection.css
│   │       ├── hooks/                 # 自定义 Hooks
│   │       │   └── useImagePreloader.js  # 图片预加载 Hook
│   │       └── images/                # 图片资源目录
│   │           ├── article-images/    # 文章配图
│   │           │   ├── article-1.jpg
│   │           │   ├── article-2.jpg
│   │           │   ├── article-3.jpg
│   │           │   ├── article-4.jpg
│   │           │   ├── article-5.jpg
│   │           │   └── article-6.jpg
│   │           └── phase-images/     # 阶段配图
│   │               ├── phase-1.jpg
│   │               ├── phase-2.jpg
│   │               ├── phase-3.jpg
│   │               ├── phase-4.jpg
│   │               ├── phase-5.jpg
│   │               └── phase-6.jpg
│   ├── data/
│   │   └── blogData.json             # 博客数据文件
│   └── index.css                      # 全局样式文件
├── public/
│   └── jobgenLogo.png                 # Logo 图片
├── App.jsx                            # 独立应用入口（包含路由）
├── main.jsx                           # React 应用入口
├── index.js                           # 包导出入口
├── index.html                         # HTML 模板
├── vite.config.js                     # Vite 配置
├── postcss.config.js                  # PostCSS 配置
├── package.json                       # 包配置和依赖
├── copy-files.js                      # 文件复制脚本
├── README.md                          # 详细文档
├── QUICK_START.md                     # 快速开始指南
├── COPY_INSTRUCTIONS.md               # 复制说明
├── STRUCTURE.md                       # 本文件
└── .gitignore                         # Git 忽略文件
```

## 📦 文件说明

### 核心文件

- **App.jsx**: 独立应用的路由配置，可以单独运行
- **main.jsx**: React 应用的入口点
- **index.js**: 包的导出入口，供其他项目导入使用
- **index.html**: HTML 模板

### 配置文件

- **package.json**: 包配置、依赖和脚本
- **vite.config.js**: Vite 构建工具配置
- **postcss.config.js**: PostCSS 配置（Tailwind CSS）
- **.gitignore**: Git 忽略规则

### 文档文件

- **README.md**: 完整的使用文档
- **QUICK_START.md**: 快速开始指南
- **COPY_INSTRUCTIONS.md**: 文件复制详细说明
- **STRUCTURE.md**: 目录结构说明（本文件）

### 工具脚本

- **copy-files.js**: 自动从主项目复制文件的脚本

## 🔄 数据流

```
blogData.json (数据源)
    ↓
BlogHome.jsx (首页)
    ├── HeroSection.jsx
    ├── TimelineSection.jsx
    ├── CategoryGrid.jsx
    └── CTASection.jsx
    ↓
ArticlePage.jsx (文章页)
    └── BlogLayout.jsx (布局)
```

## 🎯 使用场景

### 场景 1: 独立运行

使用 `App.jsx` + `main.jsx` + `index.html` 作为独立应用运行。

### 场景 2: 集成到其他项目

使用 `index.js` 导出组件，在其他项目中导入使用。

### 场景 3: 作为 npm 包发布

构建后发布到 npm，其他项目可以通过 `npm install` 安装使用。

## 📝 注意事项

1. **路径依赖**: 所有相对路径都是基于这个目录结构的
2. **数据文件**: `blogData.json` 必须存在且格式正确
3. **图片资源**: 所有图片必须复制到正确位置
4. **样式配置**: Tailwind CSS 配置在 `src/index.css` 中
5. **路由配置**: 独立运行时使用 `App.jsx`，集成时需要在主项目中配置路由

