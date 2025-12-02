/**
 * Batch upload article cover images to Firebase Storage
 * and update article records in Firestore
 * 
 * Run with: node scripts/upload-article-images.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlgEyV5X6T46S83p1mlv1tkCoSnUxO5P0",
  authDomain: "jobgen-blog.firebaseapp.com",
  projectId: "jobgen-blog",
  storageBucket: "jobgen-blog.firebasestorage.app",
  messagingSenderId: "1083925070058",
  appId: "1:1083925070058:web:0f57a29e9b1895d3fc1793"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Local image path
const IMAGES_DIR = path.join(__dirname, '../src/pages/images/article-images');

// Image file list
const imageFiles = [
  'article-1.jpg',
  'article-2.jpg',
  'article-3.jpg',
  'article-4.jpg',
  'article-5.jpg',
  'article-6.jpg'
];

// Generate deterministic image index based on article ID (matches frontend logic)
function getImageIndex(articleId) {
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % imageFiles.length;
}

// Upload single image to Firebase Storage (using Uint8Array)
async function uploadImageToStorage(imagePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(imagePath);
    const uint8Array = new Uint8Array(fileBuffer);
    
    const storageRef = ref(storage, `article-covers/${fileName}`);
    
    // Use uploadBytesResumable with Uint8Array
    const uploadTask = uploadBytesResumable(storageRef, uint8Array, {
      contentType: 'image/jpeg'
    });
    
    // Wait for upload to complete
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          process.stdout.write(`\r      Progress: ${progress.toFixed(0)}%`);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    throw error;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting batch article cover image upload...\n');
  
  try {
    // 1. First upload all images to Storage
    console.log('📤 Step 1: Uploading images to Firebase Storage...\n');
    
    const uploadedImages = {};
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join(IMAGES_DIR, imageFile);
      
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image not found: ${imageFile}`);
        continue;
      }
      
      console.log(`   Uploading: ${imageFile}...`);
      
      try {
        const url = await uploadImageToStorage(imagePath, imageFile);
        uploadedImages[imageFile] = url;
        console.log(`   ✅ Success: ${url.substring(0, 60)}...`);
      } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
      }
    }
    
    console.log(`\n📊 Upload result: ${Object.keys(uploadedImages).length}/${imageFiles.length} images\n`);
    
    if (Object.keys(uploadedImages).length === 0) {
      console.log('❌ No images uploaded successfully, exiting');
      process.exit(1);
    }
    
    // 2. Update all article image fields
    console.log('📝 Step 2: Updating article image fields...\n');
    
    const articlesRef = collection(db, 'articles');
    const querySnapshot = await getDocs(articlesRef);
    
    let updated = 0;
    let failed = 0;
    
    for (const docSnap of querySnapshot.docs) {
      const articleId = docSnap.id;
      const imageIndex = getImageIndex(articleId);
      const imageFile = imageFiles[imageIndex];
      const imageUrl = uploadedImages[imageFile];
      
      if (!imageUrl) {
        console.log(`   ⚠️  Skipping ${articleId}: corresponding image not uploaded`);
        failed++;
        continue;
      }
      
      try {
        const articleRef = doc(db, 'articles', articleId);
        await updateDoc(articleRef, { image: imageUrl });
        console.log(`   ✅ ${articleId} -> ${imageFile}`);
        updated++;
      } catch (err) {
        console.log(`   ❌ ${articleId}: ${err.message}`);
        failed++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Final result:');
    console.log(`   Updated successfully: ${updated} articles`);
    console.log(`   Update failed: ${failed} articles`);
    console.log('='.repeat(50));
    
    if (updated > 0) {
      console.log('\n✅ Batch upload completed!');
      console.log('   Frontend components can now use article.image field to display cover images');
    }
    
  } catch (error) {
    console.error('\n❌ Execution failed:', error);
  }
  
  process.exit(0);
}

main();
