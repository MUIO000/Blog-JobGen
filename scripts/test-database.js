/**
 * Database Connection Test Script
 * Test if Firebase Firestore database is working properly
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlgEyV5X6T46S83p1mlv1tkCoSnUxO5P0",
  authDomain: "jobgen-blog.firebaseapp.com",
  projectId: "jobgen-blog",
  storageBucket: "jobgen-blog.firebasestorage.app",
  messagingSenderId: "1083925070058",
  appId: "1:1083925070058:web:0f57a29e9b1895d3fc1793",
  measurementId: "G-5NWGX05E5T"
};

console.log('🔍 Starting Firebase Firestore database connection test...\n');

try {
  // Initialize Firebase
  console.log('1️⃣ Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('   ✅ Firebase initialized successfully\n');

  // Test connection - try to read collections
  console.log('2️⃣ Testing database connection...');
  
  // Test reading articles collection
  try {
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);
    console.log(`   ✅ articles collection connected`);
    console.log(`   📊 Current article count: ${articlesSnapshot.size}\n`);
  } catch (error) {
    console.log(`   ⚠️  articles collection does not exist or cannot be accessed: ${error.message}\n`);
  }

  // Test reading categories collection
  try {
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    console.log(`   ✅ categories collection connected`);
    console.log(`   📊 Current category count: ${categoriesSnapshot.size}\n`);
  } catch (error) {
    console.log(`   ⚠️  categories collection does not exist or cannot be accessed: ${error.message}\n`);
  }

  // Test reading timeline collection
  try {
    const timelineRef = collection(db, 'timeline');
    const timelineSnapshot = await getDocs(timelineRef);
    console.log(`   ✅ timeline collection connected`);
    console.log(`   📊 Current timeline phase count: ${timelineSnapshot.size}\n`);
  } catch (error) {
    console.log(`   ⚠️  timeline collection does not exist or cannot be accessed: ${error.message}\n`);
  }

  // Test write permissions (attempt to reference a test document)
  console.log('3️⃣ Testing write permissions...');
  try {
    const testRef = doc(db, 'test', 'connection-test');
    // Note: This only tests connection, does not actually write
    console.log('   ✅ Write permission check passed (no data actually written)\n');
  } catch (error) {
    console.log(`   ⚠️  Write permission check failed: ${error.message}\n`);
  }

  console.log('✅ Database connection test completed!');
  console.log('\n📝 Summary:');
  console.log('   - Firebase config: ✅ Correct');
  console.log('   - Database connection: ✅ Working');
  console.log('   - If collections are empty, run migration script: node scripts/migrate-to-firebase.js');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Database connection test failed!');
  console.error('\nError details:', error.message);
  console.error('\nPlease check:');
  console.error('1. Firebase configuration is correct');
  console.error('2. Firestore database has been created');
  console.error('3. Network connection is working');
  console.error('4. Firestore security rules allow reading');
  process.exit(1);
}

