/**
 * Blog Data Context
 * 
 * Provides blog data from Firebase to all components
 * Centralized management of articles, categories, timeline data
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getAllArticles, getAllCategories, getAllTimelinePhases } from '../firebase/articleService';

// Create Context
const BlogDataContext = createContext(null);

/**
 * Blog Data Provider
 * 
 * Loads all data from Firebase when the app starts
 */
export const BlogDataProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [articlesData, categoriesData, timelineData] = await Promise.all([
        getAllArticles(),
        getAllCategories(),
        getAllTimelinePhases()
      ]);

      // Sort timeline by phase order
      const sortedTimeline = timelineData.sort((a, b) => {
        const order = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6'];
        return order.indexOf(a.id) - order.indexOf(b.id);
      });

      setArticles(articlesData);
      setCategories(categoriesData);
      setTimeline(sortedTimeline);
    } catch (err) {
      console.error('Error loading blog data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Get single article
  const getArticle = (articleId) => {
    return articles.find(a => a.id === articleId);
  };

  // Get category
  const getCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  // Get article phase
  const getArticlePhase = (articleId) => {
    return timeline.find(p => p.articles?.includes(articleId));
  };

  // Get all articles in a category
  const getArticlesByCategory = (categoryId) => {
    return articles.filter(a => a.category === categoryId);
  };

  // Get all articles in a phase
  const getArticlesByPhase = (phaseId) => {
    const phase = timeline.find(p => p.id === phaseId);
    if (!phase || !phase.articles) return [];
    return phase.articles
      .map(articleId => articles.find(a => a.id === articleId))
      .filter(Boolean);
  };

  // Get related articles
  const getRelatedArticles = (articleId, limit = 3) => {
    const article = getArticle(articleId);
    if (!article) return [];

    // First get articles from the same category
    let related = articles
      .filter(a => a.category === article.category && a.id !== articleId)
      .slice(0, limit);

    // If not enough, add other articles
    if (related.length < limit) {
      const others = articles
        .filter(a => a.id !== articleId && !related.find(r => r.id === a.id))
        .slice(0, limit - related.length);
      related = [...related, ...others];
    }

    return related;
  };

  // Refresh data
  const refreshData = () => {
    loadData();
  };

  // Build data structure compatible with original blogData.json
  const blogData = {
    articles,
    categories,
    timeline
  };

  const value = {
    // Raw data
    articles,
    categories,
    timeline,
    // Compatible data structure
    blogData,
    // State
    loading,
    error,
    // Helper methods
    getArticle,
    getCategory,
    getArticlePhase,
    getArticlesByCategory,
    getArticlesByPhase,
    getRelatedArticles,
    refreshData
  };

  return (
    <BlogDataContext.Provider value={value}>
      {children}
    </BlogDataContext.Provider>
  );
};

/**
 * Hook to use Blog Data
 */
export const useBlogData = () => {
  const context = useContext(BlogDataContext);
  if (!context) {
    throw new Error('useBlogData must be used within a BlogDataProvider');
  }
  return context;
};

export default BlogDataContext;
