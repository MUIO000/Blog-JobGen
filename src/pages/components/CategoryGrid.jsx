import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Download, Users, Sparkles, FileText, Zap, TrendingUp, ChevronRight, Brain, Target } from 'lucide-react';
import blogData from '../../data/blogData.json';
import article1 from '../images/article-images/article-1.jpg'; // Using as feature image
import article4 from '../images/article-images/article-4.jpg'; // Using for another block
import '../css/CategoryGrid.css';

// Reusable hook for CSS fade-in animation
const useFadeIn = (delay = 0, threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// Header section with CSS animation
const HeaderSection = () => {
  const headerRef = useRef(null);
  const buttonRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    const buttonObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setButtonVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    if (headerRef.current) headerObserver.observe(headerRef.current);
    if (buttonRef.current) buttonObserver.observe(buttonRef.current);

    return () => {
      headerObserver.disconnect();
      buttonObserver.disconnect();
    };
  }, []);

  return (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div
        ref={headerRef}
        className={`category-css-animate-wrapper ${headerVisible ? 'category-animate-fade-in-up' : ''}`}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Featured <span className="text-cyan-600">Insights</span>
            </h2>
            <p className="text-lg text-slate-600">
              Curated resources to accelerate your career deployment.
            </p>
      </div>

      <button
        ref={buttonRef}
        className={`hidden md:flex items-center gap-2 text-slate-600 font-semibold hover:text-cyan-600 transition-colors group category-css-animate-wrapper ${buttonVisible ? 'category-animate-fade-in-right' : ''}`}
          >
            View all archives
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
        </div>
  );
};

// Editor's Pick Card with CSS animation
const EditorsPickCard = ({ featuredArticle }) => {
  const { ref, isVisible } = useFadeIn(0, 0.3);
  const navigate = useNavigate();

  const handleClick = () => {
    // Save scroll position and skip flag before navigating
    sessionStorage.setItem('blogScrollPosition', window.scrollY.toString());
    sessionStorage.setItem('skipHeroAnimation', 'true');
    navigate(`/blog/article/${featuredArticle.id}`);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`group relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer category-css-animate-wrapper ${isVisible ? 'category-animate-fade-in-up' : ''}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={article1} 
                alt="Featured Article" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end items-start">
              <div className="bg-cyan-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-lg">
                Editor's Pick
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-cyan-200 transition-colors">
                {featuredArticle.title}
              </h3>
              <p className="text-slate-200 text-lg line-clamp-2 mb-6 max-w-xl">
                {featuredArticle.excerpt}
              </p>
              
              <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {featuredArticle.readTime}
                </span>
                <span>•</span>
                <span>{featuredArticle.date}</span>
              </div>
            </div>
    </div>
  );
};

// Resource/Tool Card with CSS animation
const ResourceCard = () => {
  const { ref, isVisible } = useFadeIn(0, 0.3);

  return (
    <div
      ref={ref}
      className={`group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden category-css-animate-wrapper ${isVisible ? 'category-animate-fade-in-up-delay-1' : ''}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <FileText className="w-32 h-32 text-cyan-600" />
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                JobGen Copilot
              </h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  AI rewrites bullets to mirror each JD and preserve your voice.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-cyan-500" />
                  One-click export to PDF/JSON with versioned history for every role.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                  Pulls measurable wins from your interview and offer logs automatically.
                </li>
              </ul>
            </div>
            
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mt-4">
              Open Resume Builder <ArrowUpRight className="w-4 h-4" />
            </div>
    </div>
  );
};

// Interview Intelligence Card with CSS animation
const InterviewCard = () => {
  const { ref, isVisible } = useFadeIn(0, 0.3);

  return (
    <div
      ref={ref}
      className={`group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden category-css-animate-wrapper ${isVisible ? 'category-animate-fade-in-up-delay-2' : ''}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <Target className="w-32 h-32 text-blue-400" />
            </div>
             
             <div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Interview Intelligence
              </h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  AI analyzes your past interviews to predict next round questions.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-cyan-500" />
                  Generates targeted practice scenarios based on company culture.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                  Tracks improvement metrics across multiple interview cycles.
                </li>
              </ul>
             </div>

            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mt-4">
              Open Interview Prep <ArrowUpRight className="w-4 h-4" />
            </div>
    </div>
  );
};


// Category Button with CSS animation
const CategoryButton = ({ cat, index }) => {
  const { ref, isVisible } = useFadeIn(0, 0.2);

  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 hover:scale-105 transition-all text-sm font-medium flex items-center gap-2 category-css-animate-wrapper ${isVisible ? 'category-animate-fade-in-scale' : ''}`}
      style={isVisible ? {
        animationDelay: `${0.4 + index * 0.05}s`
      } : {}}
    >
      {cat.name}
            </button>
  );
};

const CategoryGrid = () => {
  // Pick a featured article (e.g., the first one from the list)
  const featuredArticle = blogData.articles.find(a => a.id === 'article-3-1') || blogData.articles[0];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <HeaderSection />

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* 1. Editor's Pick (Large 2x2 Card) */}
          <EditorsPickCard featuredArticle={featuredArticle} />

          {/* 2. Resource/Tool Card (1x1) */}
          <ResourceCard />

          {/* 3. Interview Intelligence Card (1x1) */}
          <InterviewCard />



        </div>

        {/* Categories Pills - For navigation */}
        <div className="mt-12">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Browse by Pipeline Phase</p>
          <div className="flex flex-wrap gap-3">
            {blogData.categories.map((cat, i) => (
              <CategoryButton key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
