/**
 * Standalone Blog Application
 * 
 * 这是一个独立的 Blog 应用入口
 * 可以单独运行，不依赖主应用
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogHome from './src/pages/BlogHome';
import ArticlePage from './src/pages/ArticlePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/article/:articleId" element={<ArticlePage />} />
        <Route path="/article/:articleId" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

