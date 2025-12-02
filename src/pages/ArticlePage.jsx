import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight, Share2, Bookmark, Sparkles, Briefcase } from 'lucide-react';
import BlogLayout from './BlogLayout';
import { useBlogData } from '../context/BlogDataContext';
import { EXTERNAL_LINKS } from '../config/externalLinks';
import { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

// Import article thumbnail images (same as TimelineSection)
import article1 from './images/article-images/article-1.jpg';
import article2 from './images/article-images/article-2.jpg';
import article3 from './images/article-images/article-3.jpg';
import article4 from './images/article-images/article-4.jpg';
import article5 from './images/article-images/article-5.jpg';
import article6 from './images/article-images/article-6.jpg';

// Article thumbnail images array
const articleImages = [article1, article2, article3, article4, article5, article6];

// Get article image - prioritize Firebase image, fallback to local placeholder
const getArticleImage = (article) => {
  // If article has image from Firebase, use it
  if (article?.image) {
    return article.image;
  }
  
  // Fallback to local placeholder based on articleId hash
  const articleId = article?.id || '';
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const imageIndex = Math.abs(hash) % articleImages.length;
  return articleImages[imageIndex];
};

// Get placeholder image by ID (for related articles)
const getPlaceholderImage = (articleId) => {
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const imageIndex = Math.abs(hash) % articleImages.length;
  return articleImages[imageIndex];
};

// Extract headings from markdown content
const extractHeadings = (content) => {
  const headingRegex = /^##\s+(.+)$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    headings.push({ text, id });
  }
  
  return headings;
};

// Generate slug from text
const generateSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { blogData, getArticle, getCategory, getArticlePhase, getRelatedArticles, loading } = useBlogData();
  
  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  // Loading state
  if (loading) {
    return (
      <BlogLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </BlogLayout>
    );
  }

  const article = getArticle(articleId);
  
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const phase = getArticlePhase(articleId);
  const category = getCategory(article.category);
  
  // Get cover image - prioritize Firebase image, fallback to local placeholder
  const coverImage = getArticleImage(article);
  
  // Filter related articles - using context method
  const relatedArticles = getRelatedArticles(articleId, 3);

  // Combine content array into a single markdown string
  const content = Array.isArray(article.content) 
    ? article.content.join('\n\n') 
    : (article.content || "Content not available.");

  // Extract headings from content
  const headings = useMemo(() => extractHeadings(content), [content]);
  
  // Active heading state
  const [activeHeading, setActiveHeading] = useState('');

  // Intersection Observer for active heading
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observerCallback = (entries) => {
      // Find the entry that is most visible
      let mostVisibleEntry = null;
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry) {
        setActiveHeading(mostVisibleEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all heading elements
    const headingElements = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean);
    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    // Set initial active heading if no active heading is set
    if (!activeHeading && headingElements.length > 0) {
      setActiveHeading(headings[0].id);
    }

    return () => observer.disconnect();
  }, [headings, activeHeading]);

  // Backup scroll listener to update active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);
        
        if (element) {
          const offsetTop = element.offsetTop;
          
          if (scrollPosition >= offsetTop) {
            setActiveHeading(heading.id);
            break;
          }
        }
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const navigateToBlog = (target = '/blog') => {
    if (sessionStorage.getItem('blogScrollPosition')) {
      sessionStorage.setItem('skipHeroAnimation', 'true');
    }
    navigate(target);
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <BlogLayout>
      <article className="min-h-screen pb-20">
        {/* Header / Hero */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <motion.button 
              onClick={() => navigateToBlog('/blog')}
              className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-8 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Timeline
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${category?.color || 'from-slate-500 to-slate-600'} text-white`}>
                  {category?.name || 'Article'}
                </span>
                {phase && (
                  <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded">
                    Phase: {phase.step}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content - Three Column Layout */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex gap-8 relative">
            {/* Left Sidebar - Table of Contents */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full" />
                      Contents
                    </h3>
                    
                    <nav className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-2 top-3 bottom-3 w-px bg-gradient-to-b from-sky-200 via-cyan-200 to-teal-200" />
                      
                      <div className="space-y-4 relative">
                        {headings.map((heading, index) => (
                          <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className="w-full text-left group flex items-start gap-4 relative"
                          >
                            {/* Dot - changes style when active */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className={`w-4 h-4 rounded-full bg-white border-2 transition-all duration-200 ${
                                activeHeading === heading.id
                                  ? 'border-sky-600 bg-sky-600 scale-125 shadow-lg shadow-sky-500/30'
                                  : 'border-sky-400 group-hover:border-sky-600 group-hover:bg-sky-50'
                              }`}>
                                {activeHeading === heading.id && (
                                  <div className="absolute inset-0 rounded-full bg-sky-600 animate-ping opacity-20" />
                                )}
                              </div>
                            </div>
                            
                            {/* Text */}
                            <span className={`text-sm leading-relaxed pt-0.5 transition-colors ${
                              activeHeading === heading.id
                                ? 'text-sky-600 font-semibold'
                                : 'text-slate-600 group-hover:text-sky-600'
                            }`}>
                              {heading.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </nav>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Article Content */}
            <div className="flex-1 max-w-4xl">

              <motion.div 
                className="prose prose-lg prose-slate mx-auto prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ReactMarkdown 
                  components={{
                    h2: ({node, children, ...props}) => {
                      const getText = (children) => {
                        if (typeof children === 'string') return children;
                        if (Array.isArray(children)) {
                          return children.map(child => 
                            typeof child === 'string' ? child : 
                            (child?.props?.children ? getText(child.props.children) : '')
                          ).join('');
                        }
                        return '';
                      };
                      const text = getText(children);
                      const id = generateSlug(text);
                      return (
                        <h2 id={id} {...props} className="scroll-mt-[100px]">
                          {children}
                        </h2>
                      );
                    },
                    a: ({node, ...props}) => (
                      <a {...props} className="text-sky-600 font-bold hover:underline transition-colors" />
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </motion.div>

              {/* Product CTA */}
              {phase && (
                <motion.div 
                  className="my-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

                  <div className="relative z-10 md:flex items-center justify-between gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Ready to apply this?</h3>
                      <p className="text-slate-300 mb-6 md:mb-0 max-w-md">
                        {phase.description} Use our <strong>{phase.title}</strong> tools to accelerate your career.
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(EXTERNAL_LINKS.timeline[phase.step] || EXTERNAL_LINKS.main.website, '_blank', 'noopener,noreferrer')}
                      className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-600 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      {phase.cta.text}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar - JobGen Promotion Card */}
            <aside className="hidden xl:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-sky-100 relative"
                >
                  {/* Background decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100/50 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-100/50 rounded-full blur-2xl -ml-24 -mb-24" />

                  <div className="relative p-8">
                    {/* JobGen Logo */}
                    <div className="flex items-center gap-2 mb-6">
                      <img src="/jobgenLogo.png" alt="JobGen Logo" className='w-10 h-10' />
                      <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                        JobGen.AI
                      </span>
                    </div>


                    {/* CTA Content */}
                    <h3 className="text-xl font-bold mb-3 leading-tight text-slate-900">
                      Build a Resume That Gets You Hired 58% Faster
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      In minutes, create a tailored, ATS-friendly resume proven to land 6X more interviews.
                    </p>
                    <button
                      onClick={() => window.open(EXTERNAL_LINKS.main.website, '_blank', 'noopener,noreferrer')}
                      className="w-full bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-sky-500/30 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Build Better Resume
                    </button>
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Recommended Logs</h2>
              <button 
                onClick={() => navigateToBlog('/blog')}
                className="text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((item, index) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/blog/article/${item.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-sky-200 transition-all cursor-pointer group"
                >
                  {/* Article Cover Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={getArticleImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <div className="text-xs font-mono text-slate-500 mb-3 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${blogData.categories.find(c => c.id === item.category)?.color}`} />
                      {blogData.categories.find(c => c.id === item.category)?.name}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                      <span>{item.readTime}</span>
                      <span className="group-hover:translate-x-1 transition-transform text-sky-500">Read Article →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
};

export default ArticlePage;