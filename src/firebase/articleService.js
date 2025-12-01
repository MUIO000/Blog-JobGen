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
    querySnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() });
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

// ==================== Image Upload ====================

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder name (e.g., 'article-images')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'article-images') => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The full URL of the image to delete
 */
export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
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
