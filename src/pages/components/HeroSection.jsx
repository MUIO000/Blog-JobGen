import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowDown, Terminal, Code2, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animations';

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
  return (
    <motion.section 
      className="relative w-full min-h-[90vh] bg-gradient-to-br from-white via-sky-50 to-cyan-50 flex flex-col justify-start items-center overflow-hidden pt-24 md:pt-32"
      initial={disableAnimations ? false : "hidden"}
      animate={disableAnimations ? false : "visible"}
      variants={disableAnimations ? undefined : staggerContainer}
    >
      {/* A. Background Elements */}
      {/* 1. Grid Background (Light) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e912_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e912_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* 2. Floating Orbs */}
      <motion.div 
        className="absolute top-20 left-20 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl"
        animate={disableAnimations ? undefined : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={disableAnimations ? undefined : {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
        animate={disableAnimations ? undefined : {
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.3, 0.4],
        }}
        transition={disableAnimations ? undefined : {
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* B. Left Content */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200 shadow-sm text-sm font-medium text-sky-700"
            variants={disableAnimations ? undefined : fadeInUp}
            initial={disableAnimations ? false : undefined}
            animate={disableAnimations ? false : undefined}
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
            variants={disableAnimations ? undefined : fadeInUp}
            initial={disableAnimations ? false : undefined}
            animate={disableAnimations ? false : undefined}
          >
            Don't just apply.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600">
              Deploy Your Career.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            variants={disableAnimations ? undefined : fadeInUp}
            initial={disableAnimations ? false : undefined}
            animate={disableAnimations ? false : undefined}
          >
            The definitive documentation for the modern developer's job search. 
            From <code className="bg-sky-100 px-2 py-1 rounded text-sky-700 font-mono text-base">init</code> resume 
            to <code className="bg-emerald-100 px-2 py-1 rounded text-emerald-700 font-mono text-base">merge</code> offer.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            variants={disableAnimations ? undefined : fadeInUp}
            initial={disableAnimations ? false : undefined}
            animate={disableAnimations ? false : undefined}
          >
            <button 
              className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5"
              onClick={() => {
                const timeline = document.getElementById('timeline-start');
                timeline?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Code2 className="w-5 h-5" />
              Start Documentation
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

          </motion.div>
        </div>

        {/* C. Right Visual (Terminal - Light Theme) */}
        <motion.div 
          className="hidden lg:block relative"
          initial={disableAnimations ? false : { opacity: 0, x: 20 }}
          animate={disableAnimations ? false : { opacity: 1, x: 0 }}
          transition={disableAnimations ? undefined : { duration: 0.8, delay: 0.2 }}
        >
          <div className="relative rounded-2xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden font-mono text-sm">
            {/* Terminal Header */}
            <div className="flex items-center px-4 py-3 bg-gradient-to-r from-slate-50 to-sky-50 border-b border-slate-200 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-2 text-slate-500 text-xs font-medium">user@jobgen:~/career-2026</div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 space-y-3 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex gap-2 text-slate-700">
                <span className="text-emerald-500 font-bold">➜</span>
                <span className="text-sky-500 font-bold">~</span>
                <span className="font-medium">npm install job-offers --global</span>
              </div>
              
              <div className="text-slate-500 py-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-sky-400 animate-pulse"></div>
                  [INFO] Analyzing market trends...
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-sky-400 animate-pulse"></div>
                  [INFO] Optimizing resume keywords...
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-600 text-sm font-medium">
                  <span>Building Resume Artifacts...</span>
                  <span className="text-emerald-600 font-semibold">Done (0.4s)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    initial={disableAnimations ? false : { width: 0 }}
                    animate={disableAnimations ? false : { width: "90%" }}
                    transition={disableAnimations ? undefined : { duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-600 text-sm font-medium">
                   <span>ATS Compatibility Check...</span>
                   <span className="text-sky-600 font-semibold">98/100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full"
                     initial={disableAnimations ? false : { width: 0 }}
                     animate={disableAnimations ? false : { width: "98%" }}
                     transition={disableAnimations ? undefined : { duration: 1.5, delay: 1 }}
                   />
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-slate-700">
                <span className="text-emerald-500 font-bold">➜</span>
                <span className="text-sky-500 font-bold">~</span>
                <TypewriterText disabled={disableAnimations} />
              </div>
            </div>
          </div>
          
          {/* Decorative Backdrop */}
          <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl opacity-50" />
        </motion.div>
      </div>

      {/* D. Visual Connector */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={disableAnimations ? false : { opacity: 0, y: 20 }}
        animate={disableAnimations ? false : { opacity: 1, y: 0 }}
        transition={disableAnimations ? undefined : { delay: 1.5, duration: 0.5 }}
      >
        <span className="text-xs font-mono text-slate-400 mb-4 tracking-widest uppercase font-semibold">
          Initialize Pipeline
        </span>
        {/* Animated Dotted Line */}
        <div className="relative flex flex-col items-center">
          <motion.div
            className="flex flex-col gap-1 items-center"
            animate={disableAnimations ? undefined : { 
              y: [0, 8, 0],
            }}
            transition={disableAnimations ? undefined : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-1 h-1 rounded-full bg-sky-400"></div>
            <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
            <div className="w-1 h-1 rounded-full bg-blue-400"></div>
          </motion.div>
          <motion.div
            className="absolute top-3 flex flex-col gap-2"
            animate={disableAnimations ? undefined : {
              opacity: [0, 1, 0]
            }}
            transition={disableAnimations ? undefined : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowDown className="w-5 h-5 text-sky-400" />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
