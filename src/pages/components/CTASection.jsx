import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter, Github, Send } from 'lucide-react';
import { fadeInUp, scaleIn } from '../../utils/animations';
import { EXTERNAL_LINKS } from '../../config/externalLinks';

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 shadow-xl"
            variants={scaleIn}
          >
            <Mail className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={fadeInUp}
          >
            Get Weekly Career Insights
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-xl text-sky-50 mb-10 leading-relaxed max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Join thousands of developers receiving our weekly newsletter with top interview questions, 
            AI-generated answers, and job search strategies
          </motion.p>

          {/* Email Input Form */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-6"
            variants={fadeInUp}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-2xl text-slate-900 placeholder-white-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg font-medium border-2 border-white/30"
            />
            <motion.button
              className="px-8 py-4 bg-white text-sky-600 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
              Subscribe
            </motion.button>
          </motion.div>

          {/* Privacy Note */}
          <motion.p 
            className="text-sm text-sky-100 mb-12"
            variants={fadeInUp}
          >
            No spam, ever. Unsubscribe anytime. 🔒
          </motion.p>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center gap-4"
            variants={fadeInUp}
          >
            <motion.a
              href={EXTERNAL_LINKS.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-5 h-5" strokeWidth={2} />
            </motion.a>
            
            <motion.a
              href={EXTERNAL_LINKS.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter className="w-5 h-5" strokeWidth={2} />
            </motion.a>
            
            <motion.a
              href={EXTERNAL_LINKS.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-5 h-5" strokeWidth={2} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
