/**
 * JobGen Blog Package - Entry Point
 * 
 * 这是一个独立的 Blog 模块入口文件
 * 可以作为独立应用运行，也可以被其他项目导入使用
 */

// 导出主要组件
export { default as BlogHome } from './src/pages/Blog/BlogHome.jsx';
export { default as ArticlePage } from './src/pages/Blog/ArticlePage.jsx';
export { default as BlogLayout } from './src/pages/Blog/BlogLayout.jsx';

// 导出子组件（可选）
export { default as HeroSection } from './src/pages/Blog/components/HeroSection.jsx';
export { default as TimelineSection } from './src/pages/Blog/components/TimelineSection.jsx';
export { default as CategoryGrid } from './src/pages/Blog/components/CategoryGrid.jsx';
export { default as CTASection } from './src/pages/Blog/components/CTASection.jsx';
export { default as LoadingScreen } from './src/pages/Blog/components/LoadingScreen.jsx';

// 导出 Hooks
export { default as useImagePreloader } from './src/pages/Blog/hooks/useImagePreloader.js';

// 导出数据（如果需要）
// export { default as blogData } from './src/data/blogData.json';

