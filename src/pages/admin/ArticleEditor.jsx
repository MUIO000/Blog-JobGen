import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthChange } from '../../firebase/authService';
import {
  getArticleById,
  createArticle,
  updateArticle,
  uploadImage
} from '../../firebase/articleService';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  X,
  Upload,
  Loader
} from 'lucide-react';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewArticle = id === 'new';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    excerpt: '',
    category: '',
    readTime: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    content: ['']
  });

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user);
        if (!isNewArticle) {
          loadArticle();
        }
      } else {
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, isNewArticle]);

  // Load article for editing
  const loadArticle = async () => {
    try {
      setLoading(true);
      const article = await getArticleById(id);
      setFormData(article);
    } catch (error) {
      console.error('Error loading article:', error);
      alert('加载文章失败');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle content section change
  const handleContentChange = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData((prev) => ({
      ...prev,
      content: newContent
    }));
  };

  // Add content section
  const addContentSection = () => {
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, '']
    }));
  };

  // Remove content section
  const removeContentSection = (index) => {
    if (formData.content.length > 1) {
      setFormData((prev) => ({
        ...prev,
        content: prev.content.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);

      // Insert image markdown into current content section
      const markdownImage = `\n\n![Image](${imageUrl})\n\n`;
      const lastIndex = formData.content.length - 1;
      handleContentChange(lastIndex, formData.content[lastIndex] + markdownImage);

      alert('图片上传成功！');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.excerpt || !formData.category) {
      alert('请填写所有必填字段');
      return;
    }

    try {
      setLoading(true);

      if (isNewArticle) {
        // Create new article
        await createArticle(formData);
        alert('文章创建成功！');
      } else {
        // Update existing article
        await updateArticle(id, formData);
        alert('文章更新成功！');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isNewArticle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">返回仪表板</span>
          </button>

          <h1 className="text-xl font-bold text-slate-900">
            {isNewArticle ? '新建文章' : '编辑文章'}
          </h1>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>保存文章</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">基本信息</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Article ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  文章 ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g., article-1-1"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                  disabled={!isNewArticle}
                />
                <p className="text-xs text-slate-500 mt-1">
                  唯一标识符（创建后不可修改）
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  分类 <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">选择分类</option>
                  <option value="career-paths">Career Architecture</option>
                  <option value="resume-docs">Documentation (Resume)</option>
                  <option value="job-search">Deployment (Search)</option>
                  <option value="interviews">Testing (Interviews)</option>
                  <option value="compensation">Release (Offer)</option>
                  <option value="stories">System Logs</option>
                </select>
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="输入文章标题"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  摘要 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="简短描述文章内容"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="作者姓名"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  发布日期
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  阅读时间
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="e.g., 5 min read"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">文章内容</h2>

              {/* Image Upload */}
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">上传中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">上传图片</span>
                  </>
                )}
              </label>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              使用 Markdown 格式编写内容。每个内容块代表一个段落或章节。
            </p>

            {/* Content Sections */}
            <div className="space-y-4">
              {formData.content.map((section, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded">
                      段落 {index + 1}
                    </span>
                    {formData.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentSection(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={section}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    placeholder="输入 Markdown 内容..."
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm resize-y"
                  />
                </div>
              ))}
            </div>

            {/* Add Section Button */}
            <button
              type="button"
              onClick={addContentSection}
              className="mt-4 w-full px-4 py-3 border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 font-medium rounded-lg transition-colors"
            >
              + 添加新段落
            </button>
          </div>

          {/* Submit Button (Mobile) */}
          <div className="md:hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>保存文章</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ArticleEditor;
