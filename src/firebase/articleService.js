import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './config';

const ARTICLES_COLLECTION = 'articles';
const CATEGORIES_COLLECTION = 'categories';
const TIMELINE_COLLECTION = 'timeline';

// ==================== Articles ====================

/**
 * Get all articles from Firestore
 */
export const getAllArticles = async () => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(articlesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const articles = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      articles.push({ 
        ...data,
        id: docSnap.id,  // Firestore document ID (for delete/update)
        articleId: data.id || docSnap.id  // Keep original article ID for display
      });
    });

    return articles;
  } catch (error) {
    console.error('Error getting articles:', error);
    throw error;
  }
};

/**
 * Get a single article by ID
 */
export const getArticleById = async (articleId) => {
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, articleId);
    const articleSnap = await getDoc(articleRef);

    if (articleSnap.exists()) {
      return { id: articleSnap.id, ...articleSnap.data() };
    } else {
      throw new Error('Article not found');
    }
  } catch (error) {
    console.error('Error getting article:', error);
    throw error;
  }
};

/**
 * Create a new article
 */
export const createArticle = async (articleData) => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const docRef = await addDoc(articlesRef, {
      ...articleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { id: docRef.id, ...articleData };
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * Update an existing article
 */
export const updateArticle = async (articleId, articleData) => {
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(articleRef, {
      ...articleData,
      updatedAt: serverTimestamp()
    });

    return { id: articleId, ...articleData };
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

/**
 * Delete an article
 */
export const deleteArticle = async (articleId) => {
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, articleId);
    await deleteDoc(articleRef);
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// ==================== Image Upload (Cloudinary) ====================

/**
 * Upload an image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (file) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
      throw new Error('Cloudinary configuration is missing. Please check your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Image upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete an image (Not implemented for Cloudinary unsigned)
 */
export const deleteImage = async (imageUrl) => {
  console.warn('Delete image is not supported for unsigned Cloudinary uploads from client-side.');
  return true;
};

// ==================== Categories ====================

/**
 * Get all categories from Firestore
 */
export const getAllCategories = async () => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const querySnapshot = await getDocs(categoriesRef);

    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });

    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData) => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const docRef = await addDoc(categoriesRef, categoryData);

    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// ==================== Timeline ====================

/**
 * Get all timeline phases
 */
export const getAllTimelinePhases = async () => {
  try {
    const timelineRef = collection(db, TIMELINE_COLLECTION);
    const querySnapshot = await getDocs(timelineRef);

    const timeline = [];
    querySnapshot.forEach((doc) => {
      timeline.push({ id: doc.id, ...doc.data() });
    });

    return timeline;
  } catch (error) {
    console.error('Error getting timeline:', error);
    throw error;
  }
};

/**
 * Update timeline phase
 */
export const updateTimelinePhase = async (phaseId, phaseData) => {
  try {
    const phaseRef = doc(db, TIMELINE_COLLECTION, phaseId);
    await updateDoc(phaseRef, phaseData);

    return { id: phaseId, ...phaseData };
  } catch (error) {
    console.error('Error updating timeline phase:', error);
    throw error;
  }
};
