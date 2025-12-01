/**
 * Standalone Blog Application
 *
 * 这是一个独立的 Blog 应用入口
 * 可以单独运行，不依赖主应用
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogHome from './src/pages/BlogHome';
import ArticlePage from './src/pages/ArticlePage';
import AdminLogin from './src/pages/admin/AdminLogin';
import AdminDashboard from './src/pages/admin/AdminDashboard';
import ArticleEditor from './src/pages/admin/ArticleEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BlogHome />} />
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/article/:articleId" element={<ArticlePage />} />
        <Route path="/article/:articleId" element={<ArticlePage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/article/:id" element={<ArticleEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
