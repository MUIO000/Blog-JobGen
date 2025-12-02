/**
 * External Links Configuration
 * 
 * Centralized configuration for all external links used throughout the application.
 * This makes it easy to update links in one place instead of searching through multiple files.
 * 
 * Usage:
 * import { EXTERNAL_LINKS } from '@/config/externalLinks';
 * 
 * Example:
 * <a href={EXTERNAL_LINKS.main.website}>Visit Website</a>
 * <button onClick={() => window.location.href = EXTERNAL_LINKS.main.website}>Go</button>
 */

export const EXTERNAL_LINKS = {
  // Main website and product links
  main: {
    website: 'https://jobgen.ai',
    interviewPrep: 'https://jobgen.ai',
    resumeTemplates: 'https://jobgen.ai',
    starMethod: 'https://jobgen.ai',
  },

  // Social media links
  social: {
    linkedin: 'https://jobgen.ai',
    twitter: 'https://jobgen.ai',
    github: 'https://jobgen.ai',
  },

  // Footer links
  company: {
    about: 'https://jobgen.ai/about',
    contact: 'https://jobgen.ai/contact',
    privacy: 'https://jobgen.ai/privacy',
    terms: 'https://jobgen.ai/terms',
  },

  // Timeline phase CTA links
  timeline: {
    init: 'https://jobgen.ai',
    build: 'https://jobgen.ai',
    deploy: 'https://jobgen.ai',
    test: 'https://jobgen.ai',
    release: 'https://jobgen.ai',
    logs: 'https://jobgen.ai',
  },
};

// Helper function to open link in new tab
export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Helper function to navigate to external link
export const navigateToExternal = (url) => {
  window.location.href = url;
};

export default EXTERNAL_LINKS;
