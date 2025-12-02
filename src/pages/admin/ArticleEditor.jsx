import { useState, useEffect, useRef } from 'react';
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
  Loader,
  Eye,
  ChevronDown,
  ChevronRight,
  User,
  Tag,
  Settings,
  FileText,
  Clock,
  Calendar,
  Hash,
  Star,
  Globe,
  Check
} from 'lucide-react';

// Collapsible Sidebar Section Component
const SidebarSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-700">
          <Icon className="w-4 h-4" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewArticle = id === 'new';
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [contentSections, setContentSections] = useState([
    { id: 1, type: 'heading', content: '' },
    { id: 2, type: 'text', content: '' }
  ]);
  const [nextSectionId, setNextSectionId] = useState(3);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    category: '',
    readTime: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    content: [''],
    image: '',
    featured: false,
    metaDescription: '',
    keywords: ''
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
      
      // Parse content array into sections
      const parsedSections = parseContentToSections(article.content || []);
      setContentSections(parsedSections);
      
      setFormData({
        ...article,
        subtitle: article.subtitle || '',
        featured: article.featured || false,
        metaDescription: article.metaDescription || article.excerpt || '',
        keywords: article.keywords || ''
      });
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Parse content array to section format
  const parseContentToSections = (contentArray) => {
    const sections = [];
    let id = 1;
    
    contentArray.forEach((text) => {
      const lines = text.split('\n');
      lines.forEach((line) => {
        if (line.startsWith('## ')) {
          sections.push({ id: id++, type: 'heading', content: line.replace('## ', '') });
        } else if (line.trim()) {
          sections.push({ id: id++, type: 'text', content: line });
        }
      });
    });
    
    if (sections.length === 0) {
      sections.push({ id: 1, type: 'heading', content: '' });
      sections.push({ id: 2, type: 'text', content: '' });
      id = 3;
    }
    
    setNextSectionId(id);
    return sections;
  };

  // Convert sections back to content array
  const sectionsToContent = () => {
    let markdown = '';
    contentSections.forEach((section) => {
      if (section.type === 'heading' && section.content.trim()) {
        markdown += `## ${section.content}\n\n`;
      } else if (section.type === 'text' && section.content.trim()) {
        markdown += `${section.content}\n\n`;
      } else if (section.type === 'image' && section.content.trim()) {
        markdown += `![Image](${section.content})\n\n`;
      }
    });
    return [markdown.trim()];
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add new content section
  const addSection = (type) => {
    const newSection = {
      id: nextSectionId,
      type: type,
      content: ''
    };
    setContentSections([...contentSections, newSection]);
    setNextSectionId(nextSectionId + 1);
  };

  // Update section content
  const updateSection = (id, content) => {
    setContentSections(contentSections.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  // Remove section
  const removeSection = (id) => {
    if (contentSections.length > 1) {
      setContentSections(contentSections.filter(section => section.id !== id));
    }
  };

  // Move section up
  const moveSectionUp = (index) => {
    if (index > 0) {
      const newSections = [...contentSections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      setContentSections(newSections);
    }
  };

  // Move section down
  const moveSectionDown = (index) => {
    if (index < contentSections.length - 1) {
      const newSections = [...contentSections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setContentSections(newSections);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (e) => {
    let file;
    if (e instanceof File) {
      file = e;
    } else if (e?.target?.files?.[0]) {
      file = e.target.files[0];
    } else if (e?.dataTransfer?.files?.[0]) {
      file = e.dataTransfer.files[0];
    }
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size cannot exceed 5MB');
      return;
    }

    setUploadingCover(true);
    
    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl
      }));
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert('Cover image upload failed: ' + error.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleCoverImageUpload(file);
    }
  };

  // Remove cover image
  const removeCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: ''
    }));
  };

  // Handle content image upload
  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size cannot exceed 5MB');
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      const newSection = {
        id: nextSectionId,
        type: 'image',
        content: imageUrl
      };
      setContentSections([...contentSections, newSection]);
      setNextSectionId(nextSectionId + 1);
      alert('Image inserted!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Image upload failed');
    }
  };

  // Calculate read time from content
  const calculateReadTime = () => {
    const allText = contentSections
      .filter(s => s.type === 'text' || s.type === 'heading')
      .map(s => s.content)
      .join(' ');
    const wordCount = allText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.category) {
      alert('Please fill in all required fields (Title, Excerpt, Category)');
      return;
    }

    try {
      setSaving(true);

      const articleData = {
        ...formData,
        content: sectionsToContent(),
        readTime: formData.readTime || calculateReadTime()
      };

      if (isNewArticle) {
        await createArticle(articleData);
        alert('Article created successfully!');
      } else {
        await updateArticle(id, articleData);
        setLastSaved(new Date());
        alert('Article saved!');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save, please try again');
    } finally {
      setSaving(false);
    }
  };

  // Preview article
  const handlePreview = () => {
    if (id && id !== 'new') {
      window.open(`/article/${id}`, '_blank');
    } else {
      alert('Please save the article first to preview');
    }
  };

  if (loading && !isNewArticle) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading article...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Top Action Bar - Fixed */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Dashboard</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200" />
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isNewArticle 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isNewArticle ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              {isNewArticle ? 'Draft' : 'Published'}
            </span>
            
            {lastSaved && (
              <span className="text-xs text-slate-400 hidden sm:inline">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isNewArticle ? 'Publish' : 'Save'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content Editor (75-80%) */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-6">
            
            {/* Hero Image Upload */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {formData.image ? (
                <div className="relative group">
                  <img 
                    src={formData.image} 
                    alt="Cover" 
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/90 hover:bg-white text-slate-700 font-medium rounded-lg transition-colors"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <label 
                  className="flex flex-col items-center justify-center h-64 lg:h-80 border-2 border-dashed border-slate-300 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50/50 cursor-pointer transition-all"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                  {uploadingCover ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader className="w-10 h-10 animate-spin text-cyan-500" />
                      <span className="text-slate-500 font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-slate-600">Drop your cover image here</p>
                        <p className="text-sm">or click to browse</p>
                      </div>
                      <span className="text-xs">JPG, PNG, GIF up to 5MB</span>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* Title & Subtitle - Document Style */}
            <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-200 p-8 lg:p-10 shadow-sm space-y-5">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article Title"
                className="w-full text-4xl lg:text-5xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none focus:ring-0 bg-transparent leading-tight"
              />
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Add a subtitle (optional)"
                className="w-full text-xl text-slate-600 placeholder-slate-300 border-none outline-none focus:ring-0 bg-transparent"
              />
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Summary / Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Write a brief summary that will appear in article cards..."
                  rows={3}
                  className="w-full text-slate-700 placeholder-slate-400 border-none outline-none focus:ring-0 bg-transparent resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Main Content Editor */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600" />
                  Article Content
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addSection('heading')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-cyan-50 text-cyan-700 text-sm font-medium rounded-lg border border-cyan-200 transition-colors"
                  >
                    <Hash className="w-4 h-4" />
                    <span>Add Heading</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('text')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Add Paragraph</span>
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg cursor-pointer border border-slate-200 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleContentImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-4 h-4" />
                    <span>Add Image</span>
                  </label>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {contentSections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`group relative rounded-xl border-2 transition-all ${
                      section.type === 'heading'
                        ? 'border-cyan-200 bg-gradient-to-r from-cyan-50/50 to-blue-50/50'
                        : section.type === 'image'
                        ? 'border-purple-200 bg-purple-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Section Controls */}
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveSectionUp(index)}
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 shadow-sm transition-colors"
                          title="Move up"
                        >
                          <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      )}
                      {index < contentSections.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveSectionDown(index)}
                          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 shadow-sm transition-colors"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 shadow-sm transition-colors"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Section Content */}
                    <div className="p-4">
                      {section.type === 'heading' ? (
                        <div>
                          <label className="block text-xs font-medium text-cyan-700 mb-2 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Section Heading (H2)
                          </label>
                          <input
                            type="text"
                            value={section.content}
                            onChange={(e) => updateSection(section.id, e.target.value)}
                            placeholder="Enter section heading..."
                            className="w-full text-2xl font-bold text-slate-800 placeholder-slate-300 border-none outline-none focus:ring-0 bg-transparent"
                          />
                        </div>
                      ) : section.type === 'image' ? (
                        <div>
                          <label className="block text-xs font-medium text-purple-700 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            Image
                          </label>
                          <img
                            src={section.content}
                            alt="Content"
                            className="w-full rounded-lg border border-slate-200"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Paragraph
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, e.target.value)}
                            placeholder="Write your paragraph content here. You can use **bold**, *italic*, and other basic markdown formatting..."
                            rows={4}
                            className="w-full text-slate-700 placeholder-slate-400 border-none outline-none focus:ring-0 bg-transparent resize-y leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {contentSections.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No content yet. Click "Add Heading" or "Add Paragraph" to start.</p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>💡 Headings will appear in article navigation</span>
                <span>
                  {contentSections.filter(s => s.type === 'text' || s.type === 'heading')
                    .map(s => s.content)
                    .join(' ')
                    .split(/\s+/)
                    .filter(Boolean).length} words
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Right: Settings Sidebar (20-25%) */}
        <aside className="w-72 lg:w-130 bg-white border-l border-slate-200 overflow-y-auto shrink-0 hidden md:block shadow-lg">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 z-10">
            <h2 className="font-bold text-slate-900">Settings</h2>
          </div>

          {/* General Settings */}
          <SidebarSection title="General" icon={Settings} defaultOpen={true}>
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select...</option>
                <option value="career-paths">Career Architecture</option>
                <option value="resume-docs">Documentation (Resume)</option>
                <option value="job-search">Deployment (Search)</option>
                <option value="interviews">Testing (Interviews)</option>
                <option value="compensation">Release (Offer)</option>
                <option value="stories">System Logs</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Publish Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                <Clock className="w-3 h-3 inline mr-1" />
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder={calculateReadTime()}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-1">Auto-calculated if empty</p>
            </div>
          </SidebarSection>

          {/* Author Settings */}
          <SidebarSection title="Author" icon={User} defaultOpen={true}>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </SidebarSection>

          {/* SEO Settings */}
          <SidebarSection title="SEO & Meta" icon={Globe} defaultOpen={false}>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="SEO description for search engines..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                <Hash className="w-3 h-3 inline mr-1" />
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </SidebarSection>

          {/* Advanced Settings */}
          <SidebarSection title="Advanced" icon={Star} defaultOpen={false}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-700">Featured Article</span>
                <p className="text-xs text-slate-500">Show on homepage hero section</p>
              </div>
            </label>
          </SidebarSection>

          {/* Quick Tips */}
          <div className="p-4 m-4 bg-cyan-50 rounded-xl border border-cyan-100">
            <h4 className="text-sm font-semibold text-cyan-800 mb-2">💡 Quick Tips</h4>
            <ul className="text-xs text-cyan-700 space-y-1">
              <li>• Use # for headings in content</li>
              <li>• Drag & drop images to cover area</li>
              <li>• Preview before publishing</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Mobile Settings Button */}
      <div className="md:hidden fixed bottom-4 right-4">
        <button
          type="button"
          onClick={() => {
            // Could implement a mobile drawer here
            alert('On mobile, scroll down to see all fields. Settings are shown inline.');
          }}
          className="p-4 bg-cyan-500 text-white rounded-full shadow-lg"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ArticleEditor;
