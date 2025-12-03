import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowDown, Terminal, Code2, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import Spline from '@splinetool/react-spline';

const TypewriterText = ({ disabled = false }) => {
  const fullText = "waiting for input";
  const [displayedText, setDisplayedText] = useState(() => (disabled ? fullText : ''));
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => (disabled ? fullText.length : 0));
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (disabled) {
      setDisplayedText(fullText);
      return;
    }

    const timeout = setTimeout(() => {
      if (waitTime > 0) {
        setWaitTime(prev => prev - 1);
        return;
      }

      if (!isDeleting && currentIndex < fullText.length) {
        // Typing: add one character
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      } else if (!isDeleting && currentIndex === fullText.length) {
        // Finished typing, wait before deleting
        setWaitTime(30); // Wait for 30 cycles (~1.5 seconds at 50ms)
        setIsDeleting(true);
      } else if (isDeleting && currentIndex > 0) {
        // Deleting: remove one character
        setDisplayedText(fullText.slice(0, currentIndex - 1));
        setCurrentIndex(prev => prev - 1);
      } else if (isDeleting && currentIndex === 0) {
        // Finished deleting, wait before typing again
        setWaitTime(20); // Wait for 20 cycles (~1 second)
        setIsDeleting(false);
      }
    }, 50); // Typing speed: 50ms per character

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, waitTime, fullText, disabled]);

  return (
    <span className="font-medium">
      {displayedText}
      <span className="inline-block w-2 h-4 ml-1 bg-sky-500 align-middle animate-pulse"></span>
    </span>
  );
};

const HeroSection = ({ disableAnimations = false }) => {
  // Mouse interaction state
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring animation for mouse movement
  const mouseX = useSpring(x, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 40, damping: 25 });

  useEffect(() => {
    if (disableAnimations) return;
    
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse position from -1 to 1
      x.set((e.clientX - innerWidth / 2) / (innerWidth / 2));
      y.set((e.clientY - innerHeight / 2) / (innerHeight / 2));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, disableAnimations]);

  // Parallax transforms for background orbs
  const orb1X = useTransform(mouseX, [-1, 1], [30, -30]);
  const orb1Y = useTransform(mouseY, [-1, 1], [30, -30]);
  const orb2X = useTransform(mouseX, [-1, 1], [-40, 40]);
  const orb2Y = useTransform(mouseY, [-1, 1], [-40, 40]);
  
  // 3D Tilt transform for Terminal
  const terminalRotateX = useTransform(mouseY, [-1, 1], [5, -5]);
  const terminalRotateY = useTransform(mouseX, [-1, 1], [-5, 5]);

  return (
    <motion.section 
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden perspective-1000"
      style={{ backgroundColor: 'rgb(239, 250, 255)' }}
      initial={disableAnimations ? false : "hidden"}
      animate={disableAnimations ? false : "visible"}
      variants={disableAnimations ? undefined : staggerContainer}
    >
      {/* A. Background Elements - Removed for pure solid color */}

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center h-full">
        
        {/* B. Left Content */}
        <div className="space-y-8 text-center lg:text-left lg:pr-8">
          {/* Badge with Hover Effect */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200 shadow-sm text-sm font-medium text-sky-700 cursor-default hover:shadow-md hover:border-sky-300 transition-all"
            variants={disableAnimations ? undefined : fadeInUp}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <Sparkles className="w-4 h-4" />
            <span className="font-mono">v2.0 Hiring Season Active</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
            style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
            variants={disableAnimations ? undefined : fadeInUp}
          >
            Don't just apply.
            <br />
            <span className="relative inline-block group">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-[length:200%_auto] animate-gradient">
                Deploy Your Career.
              </span>
              {/* Shine Effect */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 2 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            variants={disableAnimations ? undefined : fadeInUp}
          >
            The definitive documentation for the modern developer's job search. 
            From <code className="bg-sky-100 px-2 py-1 rounded text-sky-700 font-mono text-base hover:bg-sky-200 transition-colors cursor-help">init</code> resume 
            to <code className="bg-emerald-100 px-2 py-1 rounded text-emerald-700 font-mono text-base hover:bg-emerald-200 transition-colors cursor-help">merge</code> offer.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            variants={disableAnimations ? undefined : fadeInUp}
          >
            <motion.button 
              className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-2xl font-semibold overflow-hidden shadow-lg shadow-sky-500/25"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const timeline = document.getElementById('timeline-start');
                timeline?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center justify-center gap-2">
                <Code2 className="w-5 h-5" />
                Start Documentation
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
            </motion.button>

          </motion.div>
        </div>

        {/* C. Right Visual (Spline 3D Scene) - Full Height */}
        <motion.div 
          className="hidden lg:block absolute right-0 top-0 h-full w-1/2 perspective-1000"
          initial={disableAnimations ? false : { opacity: 0, x: 20 }}
          animate={disableAnimations ? false : { opacity: 1, x: 0 }}
          transition={disableAnimations ? undefined : { duration: 1.2, delay: 0.2 }}
        >
          <div className="relative h-full w-full bg-transparent">
            <Spline scene="https://prod.spline.design/i1odrbXEaFz7O0AK/scene.splinecode" />
          </div>
        
        </motion.div>
      </div>

      {/* D. Visual Connector */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={disableAnimations ? false : { opacity: 0, y: 20 }}
        animate={disableAnimations ? false : { opacity: 1, y: 0 }}
        transition={disableAnimations ? undefined : { delay: 1.5, duration: 0.5 }}
      >
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
