import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';

const BlogLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Blog Header/Navbar */}
      <motion.header 
        className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Back to App */}
            <Link to="/">
              <motion.div 
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src="/jobgenLogo.png" 
                  alt="JobGen Logo" 
                  className="w-10 h-10 brightness-110 contrast-110 filter transition-all group-hover:brightness-125" 
                />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
                    JobGen.AI
                  </h1>
                </div>
              </motion.div>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">


              {/* Try Free Button */}
              <motion.button
                className="px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/interview-prep'}
              >
                Try JobGen Free
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content with Page Transition */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Blog Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <img 
                src="/jobgenLogo.png" 
                alt="JobGen Logo" 
                className="w-12 h-12 brightness-110 contrast-110 filter mb-4 bg-white rounded-full p-2"  
              />
              <h3 className="text-xl font-bold mb-2">JobGen</h3>
              <p className="text-slate-400 text-sm">
                Your AI-powered job search companion
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-4 text-sky-400">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="/interview-prep" className="hover:text-white transition-colors">Interview Prep</a></li>
                <li><a href="/resumes-builder" className="hover:text-white transition-colors">Resume Builder</a></li>
                <li><a href="/jobs-tracker" className="hover:text-white transition-colors">Job Tracker</a></li>
                <li><a href="/home" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sky-400">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">STAR Method Guide</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-sky-400">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 JobGen. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" strokeWidth={2} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default BlogLayout;

