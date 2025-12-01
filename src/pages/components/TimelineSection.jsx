/**
 * Fiber Optic Timeline Component (Performance Optimized)
 *
 * Optimizations:
 * - Single useScroll hook shared across all phases (reduced from 7 to 1)
 * - CSS-driven color transitions instead of useTransform interpolation
 * - Conditional shimmer animation (only when visible)
 * - Minimal willChange usage
 * - Transform/opacity-only animations for GPU acceleration
 *
 * Preserved:
 * - Central blue fiber optic fill animation (core feature)
 * - Smooth scroll-based interactions
 * - All visual effects
 */

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, FileCode, Rocket, Beaker, Tag, Scroll, ArrowRight } from 'lucide-react';
import { fadeInLeft, fadeInRight, timelineItem } from '../../utils/animations';
import blogData from '../../data/blogData.json';
import '../css/TimelineSection.css';

// Import phase images
import phase1Image from '../images/phase-images/phase-1.jpg';
import phase2Image from '../images/phase-images/phase-2.jpg';
import phase3Image from '../images/phase-images/phase-3.jpg';
import phase4Image from '../images/phase-images/phase-4.jpg';
import phase5Image from '../images/phase-images/phase-5.jpg';
import phase6Image from '../images/phase-images/phase-6.jpg';

// Import article thumbnail images (for Recommended Logs cards)
import article1 from '../images/article-images/article-1.jpg';
import article2 from '../images/article-images/article-2.jpg';
import article3 from '../images/article-images/article-3.jpg';
import article4 from '../images/article-images/article-4.jpg';
import article5 from '../images/article-images/article-5.jpg';
import article6 from '../images/article-images/article-6.jpg';

// Phase images array - each index corresponds to a phase
const phaseImages = [
  phase1Image,  // Phase 1: init
  phase2Image,  // Phase 2: build
  phase3Image,  // Phase 3: deploy
  phase4Image,  // Phase 4: test
  phase5Image,  // Phase 5: release
  phase6Image   // Phase 6: logs
];

// Article thumbnail images for Recommended Logs cards
const articleImages = [article1, article2, article3, article4, article5, article6];

// Randomly shuffle function for article images
const getRandomArticleImage = (articleId) => {
  // Create a deterministic but seemingly random selection based on article ID
  // This ensures the same article always gets the same image (good for preloading)
  // Uses a simple hash-like function to distribute images more randomly
  let hash = 0;
  const str = articleId;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Make sure we get a positive number
  const imageIndex = Math.abs(hash) % articleImages.length;
  return articleImages[imageIndex];
};

// Icon mapping for each phase
const phaseIcons = {
  init: Terminal,
  build: FileCode,
  deploy: Rocket,
  test: Beaker,
  release: Tag,
  logs: Scroll
};

// Header section with CSS animation
const HeaderSection = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`timeline-css-animate-wrapper ${isVisible ? 'timeline-animate-fade-in-up' : ''}`}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
        The Career{' '}
        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-mono">
          CI/CD Pipeline
        </span>
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        A systematic workflow to build, test, and deploy your career.
      </p>
    </div>
  );
};

const FiberOpticTimeline = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Single scroll listener for entire timeline (optimization: 1 instead of 7)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  // Optimized: Clamp and smooth the main fiber fill animation
  const clampedProgress = useTransform(scrollYProgress, (latest) => {
    if (latest === null || latest === undefined || isNaN(latest)) return 0;
    return Math.max(0, Math.min(1, latest));
  });

  const minProgress = useTransform(clampedProgress, v => 0.01 + v * 0.99);

  // Main fiber fill animation (preserved - core feature)
  const scaleY = useSpring(minProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    mass: 0.5
  });

  // Intersection Observer: Only run shimmer when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    // Outer Wrapper: Contains Header and Timeline separately
    <div 
      id="timeline-start" 
      className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30"
    >
      {/* Section Header - Outside of scroll container */}
      <div className="text-center pt-32 pb-16 px-4 relative z-10">
        <HeaderSection />
      </div>

      {/* Timeline Scroll Container - This is the scroll target */}
      <div
        className="relative py-16 min-h-screen"
        ref={containerRef}
      >
        {/* Main Timeline Container */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">

        {/* Central Fiber Optic Tube */}
        <div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 z-0"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Background tube */}
          <div className="absolute inset-0 bg-slate-200/50 rounded-full" />

          {/* Flowing liquid fill - Core Animation (Preserved) */}
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 rounded-full origin-top"
            initial={false}
            style={{
              scaleY: scaleY,
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
            }}
          >
            {/* Optimized: Shimmer only runs when timeline is visible */}
            {isVisible && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-48 md:space-y-56 relative z-10">
          {blogData.timeline.map((step, index) => (
            <TimelineNode
              key={step.id}
              step={step}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

const TimelineNode = ({ step, index, scrollYProgress }) => {
  const nodeRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const imageOnRight = index % 2 === 0; // Phase 1, 3, 5: image right
  const PhaseIcon = phaseIcons[step.step] || Terminal;

  // Get relevant articles
  const articles = blogData.articles.filter(article =>
    step.articles.includes(article.id)
  ).slice(0, 3);

  // Optimized: Single IntersectionObserver instead of individual useScroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Activate when node enters viewport center
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setIsActive(true);
        }
      },
      { threshold: [0.3, 0.5] }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={nodeRef} className="relative grid md:grid-cols-2 gap-12 md:gap-32 items-center min-h-[400px]">

      {/* Central Node (Hub) - Optimized with CSS transitions */}
      <div className="absolute left-4 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className={`
            relative w-16 h-16 rounded-full flex items-center justify-center bg-white border-4 shadow-lg
            transition-all duration-500 ease-out
            ${isActive
              ? 'border-cyan-400 shadow-cyan-400/60 scale-110'
              : 'border-slate-100 shadow-md scale-100'
            }
          `}
        >
          <PhaseIcon
            className={`
              w-7 h-7 transition-colors duration-500
              ${isActive ? 'text-sky-500' : 'text-slate-400'}
            `}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Left Column */}
      <div className={`pl-16 md:pl-0 ${imageOnRight ? 'md:col-start-1 md:pr-8' : 'md:col-start-1 md:pr-8'}`}>
        {imageOnRight ? (
          <ContentCard step={step} articles={articles} isActive={isActive} />
        ) : (
          <ImageCard step={step} icon={PhaseIcon} index={index} scrollYProgress={scrollYProgress} />
        )}
      </div>

      {/* Right Column */}
      <div className={`pl-16 md:pl-0 ${imageOnRight ? 'md:col-start-2 md:pl-8' : 'md:col-start-2 md:pl-8'}`}>
        {imageOnRight ? (
          <ImageCard step={step} icon={PhaseIcon} index={index} scrollYProgress={scrollYProgress} />
        ) : (
          <ContentCard step={step} articles={articles} isActive={isActive} />
        )}
      </div>

    </div>
  );
};

// Article card with CSS animation
const ArticleCard = ({ article, index }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const delayClass = index === 0 ? 'timeline-animate-fade-in-up-delay-1' : 
                     index === 1 ? 'timeline-animate-fade-in-up-delay-2' : 
                     'timeline-animate-fade-in-up-delay-3';

  const handleClick = () => {
    // Save scroll position and flag hero animation skip before navigating
    sessionStorage.setItem('blogScrollPosition', window.scrollY.toString());
    sessionStorage.setItem('skipHeroAnimation', 'true');
    navigate(`/blog/article/${article.id}`);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`group relative rounded-xl border-2 border-slate-100 bg-white hover:border-sky-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden timeline-css-animate-wrapper ${isVisible ? delayClass : ''}`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail Image - Optimized */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-100">
          <img
            src={getRandomArticleImage(article.id)}
            alt={article.title}
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {article.category}
          </p>
        </div>

        {/* Arrow Icon */}
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </div>
  );
};

const ContentCard = ({ step, articles, isActive }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`space-y-4 timeline-css-animate-wrapper ${isVisible ? 'timeline-animate-fade-in-up' : ''}`}
    >
      {/* Phase Tag - Optimized with CSS transitions */}
      <div
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold
          transition-all duration-500 ease-out
          ${isActive
            ? 'bg-sky-100 text-sky-700'
            : 'bg-slate-100 text-slate-600'
          }
        `}
      >
        {step.step}
      </div>

      {/* Title & Desc */}
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
        {step.title}
      </h3>
      <p className="text-lg text-cyan-700 font-medium">{step.subtitle}</p>
      
      <p className="text-slate-600 leading-relaxed">
        {step.description}
      </p>

      {/* Articles List - Horizontal Slide In */}
      <div className="pt-6 space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recommended Logs
        </p>
        <div className="grid grid-cols-1 gap-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-lg hover:bg-cyan-600 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
        onClick={() => window.location.href = step.cta.link}
      >
        {step.cta.text}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const ImageCard = ({ step, icon: Icon, index, scrollYProgress }) => {
  const imageUrl = phaseImages[index] || phase1Image;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Image specific parallax/fade animation (subtle scale effect)
  // scrollYProgress is provided from TimelineNode which gets it from FiberOpticTimeline
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`hidden md:block h-full timeline-css-animate-wrapper ${isVisible ? 'timeline-animate-fade-in-up' : ''}`}
    >
    <motion.div
        className="h-full"
      style={{ 
        scale,
        willChange: 'transform' // Hint optimization
      }}
    >
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-100 shadow-xl group hover:shadow-2xl hover:border-sky-200 transition-all duration-300">
        {/* Preloaded Image */}
        <img
          src={imageUrl}
          alt={`${step.title} illustration`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-semibold">{step.title}</div>
              <div className="text-xs text-slate-300 font-mono">Phase {index + 1}</div>
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
    </div>
  );
};

export default FiberOpticTimeline;
