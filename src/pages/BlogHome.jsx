import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import BlogLayout from './BlogLayout';
import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import CategoryGrid from './components/CategoryGrid';
import CTASection from './components/CTASection';
import LoadingScreen from './components/LoadingScreen';
import useImagePreloader from './hooks/useImagePreloader';

// Import all images that need to be preloaded
import phase1Image from './images/phase-images/phase-1.jpg';
import phase2Image from './images/phase-images/phase-2.jpg';
import phase3Image from './images/phase-images/phase-3.jpg';
import phase4Image from './images/phase-images/phase-4.jpg';
import phase5Image from './images/phase-images/phase-5.jpg';
import phase6Image from './images/phase-images/phase-6.jpg';
import article1 from './images/article-images/article-1.jpg';
import article2 from './images/article-images/article-2.jpg';
import article3 from './images/article-images/article-3.jpg';
import article4 from './images/article-images/article-4.jpg';
import article5 from './images/article-images/article-5.jpg';
import article6 from './images/article-images/article-6.jpg';

// All images to preload
const imagesToPreload = [
  phase1Image,
  phase2Image,
  phase3Image,
  phase4Image,
  phase5Image,
  phase6Image,
  article1,
  article2,
  article3,
  article4,
  article5,
  article6,
];

const BlogHome = () => {
  const [hasLoaded, setHasLoaded] = useState(() => {
    return sessionStorage.getItem('blogLoaded') === 'true';
  });
  const [skipHeroAnimation] = useState(() => sessionStorage.getItem('skipHeroAnimation') === 'true');
  
  const { loading, progress } = useImagePreloader(hasLoaded ? [] : imagesToPreload);

  useEffect(() => {
    if (!loading) {
      sessionStorage.setItem('blogLoaded', 'true');
      setHasLoaded(true);
    }
  }, [loading]);

  // Save scroll position before leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('blogScrollPosition', window.scrollY.toString());
    };

    const handleScroll = () => {
      // Throttle scroll position saving
      clearTimeout(window.blogScrollTimeout);
      window.blogScrollTimeout = setTimeout(() => {
        sessionStorage.setItem('blogScrollPosition', window.scrollY.toString());
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(window.blogScrollTimeout);
    };
  }, []);

  // Clear the skip flag once we're back on the blog (without re-enabling animations mid-session)
  useEffect(() => {
    if (!loading && skipHeroAnimation) {
      sessionStorage.removeItem('skipHeroAnimation');
    }
  }, [loading, skipHeroAnimation]);

  // Restore scroll position after content loads
  useEffect(() => {
    if (!loading && hasLoaded) {
      const savedPosition = sessionStorage.getItem('blogScrollPosition');
      if (savedPosition) {
        // Wait a bit for DOM to fully render, then restore scroll position
        const timer = setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: 'auto' // Instant scroll, no animation
          });
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [loading, hasLoaded]);

  const showLoading = loading && !hasLoaded;

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && <LoadingScreen key="loading" progress={progress} />}
      </AnimatePresence>
      
      {(!showLoading) && (
        <BlogLayout>
          <HeroSection disableAnimations={skipHeroAnimation} />
          <TimelineSection />
          <CategoryGrid />
          <CTASection />
        </BlogLayout>
      )}
    </>
  );
};

export default BlogHome;

