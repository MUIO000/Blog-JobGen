/**
 * Firebase Data Fetch Test Script
 * Used to verify Firebase connection and data structure
 * 
 * Run with: node scripts/test-firebase-data.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlgEyV5X6T46S83p1mlv1tkCoSnUxO5P0",
  authDomain: "jobgen-blog.firebaseapp.com",
  projectId: "jobgen-blog",
  storageBucket: "jobgen-blog.firebasestorage.app",
  messagingSenderId: "1083925070058",
  appId: "1:1083925070058:web:0f57a29e9b1895d3fc1793"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebaseData() {
  console.log('🔥 Starting Firebase data fetch test...\n');
  
  try {
    // 1. Test Articles
    console.log('📄 Testing Articles collection...');
    const articlesRef = collection(db, 'articles');
    const articlesQuery = query(articlesRef, orderBy('date', 'desc'));
    const articlesSnapshot = await getDocs(articlesQuery);
    
    const articles = [];
    articlesSnapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`  ✅ Successfully fetched ${articles.length} articles`);
    if (articles.length > 0) {
      console.log('  📝 First article sample:');
      const sample = articles[0];
      console.log(`     - ID: ${sample.id}`);
      console.log(`     - Title: ${sample.title}`);
      console.log(`     - Category: ${sample.category}`);
      console.log(`     - Author: ${sample.author}`);
      console.log(`     - Date: ${sample.date}`);
      console.log(`     - Content sections: ${Array.isArray(sample.content) ? sample.content.length : 'N/A'}`);
    }
    
    // 2. Test Categories
    console.log('\n📂 Testing Categories collection...');
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    const categories = [];
    categoriesSnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`  ✅ Successfully fetched ${categories.length} categories`);
    if (categories.length > 0) {
      console.log('  📁 Category list:');
      categories.forEach((cat) => {
        console.log(`     - ${cat.id}: ${cat.name}`);
      });
    }
    
    // 3. Test Timeline
    console.log('\n⏱️ Testing Timeline collection...');
    const timelineRef = collection(db, 'timeline');
    const timelineSnapshot = await getDocs(timelineRef);
    
    const timeline = [];
    timelineSnapshot.forEach((doc) => {
      timeline.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`  ✅ Successfully fetched ${timeline.length} phases`);
    if (timeline.length > 0) {
      console.log('  📊 Phase list:');
      timeline.forEach((phase) => {
        console.log(`     - ${phase.id}: ${phase.title} (${phase.articles?.length || 0} articles)`);
      });
    }
    
    // 4. Data structure validation
    console.log('\n🔍 Data structure validation...');
    
    // Check required article fields
    const requiredArticleFields = ['title', 'excerpt', 'category', 'author', 'date', 'content', 'readTime'];
    let articleFieldsValid = true;
    
    if (articles.length > 0) {
      const missingFields = requiredArticleFields.filter(field => !(field in articles[0]));
      if (missingFields.length > 0) {
        console.log(`  ⚠️ Article missing fields: ${missingFields.join(', ')}`);
        articleFieldsValid = false;
      } else {
        console.log('  ✅ Article data structure complete');
      }
    }
    
    // Check required category fields
    const requiredCategoryFields = ['name', 'description', 'icon', 'color'];
    if (categories.length > 0) {
      const missingFields = requiredCategoryFields.filter(field => !(field in categories[0]));
      if (missingFields.length > 0) {
        console.log(`  ⚠️ Category missing fields: ${missingFields.join(', ')}`);
      } else {
        console.log('  ✅ Category data structure complete');
      }
    }
    
    // Check required timeline fields
    const requiredTimelineFields = ['step', 'title', 'subtitle', 'description', 'color', 'icon', 'articles'];
    if (timeline.length > 0) {
      const missingFields = requiredTimelineFields.filter(field => !(field in timeline[0]));
      if (missingFields.length > 0) {
        console.log(`  ⚠️ Timeline missing fields: ${missingFields.join(', ')}`);
      } else {
        console.log('  ✅ Timeline data structure complete');
      }
    }
    
    // 5. Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log(`   Articles: ${articles.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Timeline phases: ${timeline.length}`);
    
    if (articles.length > 0 && categories.length > 0 && timeline.length > 0) {
      console.log('\n✅ Firebase data fetch successful! Ready for migration.');
    } else {
      console.log('\n⚠️ Some data is missing, please ensure Firebase database is initialized.');
      console.log('   You can run node scripts/migrate-to-firebase.js to migrate local data');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
  
  process.exit(0);
}

testFirebaseData();
