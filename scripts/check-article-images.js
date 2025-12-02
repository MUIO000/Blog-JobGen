/**
 * Check article image fields in Firebase database
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlgEyV5X6T46S83p1mlv1tkCoSnUxO5P0",
  authDomain: "jobgen-blog.firebaseapp.com",
  projectId: "jobgen-blog"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkArticleImages() {
  console.log('🔍 Checking Firebase article image fields...\n');
  
  try {
    const articlesRef = collection(db, 'articles');
    const querySnapshot = await getDocs(articlesRef);
    
    let hasImage = 0;
    let noImage = 0;
    
    console.log('Article image field check results:\n');
    console.log('=' .repeat(60));
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const imageFields = {
        image: data.image,
        coverImage: data.coverImage,
        thumbnail: data.thumbnail,
        imageUrl: data.imageUrl
      };
      
      // Check if any image field exists
      const hasAnyImage = Object.values(imageFields).some(v => v && v.length > 0);
      
      if (hasAnyImage) {
        hasImage++;
        console.log(`✅ ${doc.id}`);
        console.log(`   Title: ${data.title?.substring(0, 40)}...`);
        Object.entries(imageFields).forEach(([key, value]) => {
          if (value) console.log(`   ${key}: ${value.substring(0, 50)}...`);
        });
      } else {
        noImage++;
        console.log(`❌ ${doc.id}`);
        console.log(`   Title: ${data.title?.substring(0, 40)}...`);
        console.log(`   (no image field)`);
      }
      console.log('');
    });
    
    console.log('=' .repeat(60));
    console.log('\n📊 Statistics:');
    console.log(`   Total articles: ${querySnapshot.size}`);
    console.log(`   With image field: ${hasImage}`);
    console.log(`   Without image field: ${noImage}`);
    
    if (noImage > 0) {
      console.log('\n⚠️  Warning: Some articles are missing image fields!');
      console.log('   Recommend editing articles via Admin dashboard and uploading images');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
  
  process.exit(0);
}

checkArticleImages();
