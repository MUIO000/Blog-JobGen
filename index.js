/**
 * JobGen Blog Package - Entry Point
 * 
 * This is the entry file for the standalone Blog module
 * It can run as a standalone application or be imported by other projects
 */

// Export main components
export { default as BlogHome } from './src/pages/Blog/BlogHome.jsx';
export { default as ArticlePage } from './src/pages/Blog/ArticlePage.jsx';
export { default as BlogLayout } from './src/pages/Blog/BlogLayout.jsx';

// Export sub-components (optional)
export { default as HeroSection } from './src/pages/Blog/components/HeroSection.jsx';
export { default as TimelineSection } from './src/pages/Blog/components/TimelineSection.jsx';
export { default as CategoryGrid } from './src/pages/Blog/components/CategoryGrid.jsx';
export { default as CTASection } from './src/pages/Blog/components/CTASection.jsx';
export { default as LoadingScreen } from './src/pages/Blog/components/LoadingScreen.jsx';

// Export Hooks
export { default as useImagePreloader } from './src/pages/Blog/hooks/useImagePreloader.js';

// Export data (if needed)
// export { default as blogData } from './src/data/blogData.json';

