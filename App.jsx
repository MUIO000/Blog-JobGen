/**
 * Standalone Blog Application
 *
 * This is the entry point for the standalone Blog app
 * It can run independently without relying on the main application
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogDataProvider } from './src/context/BlogDataContext';
import BlogHome from './src/pages/BlogHome';
import ArticlePage from './src/pages/ArticlePage';
import AdminLogin from './src/pages/admin/AdminLogin';
import AdminDashboard from './src/pages/admin/AdminDashboard';
import ArticleEditor from './src/pages/admin/ArticleEditor';

function App() {
  return (
    <BlogDataProvider>
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
    </BlogDataProvider>
  );
}

export default App;
