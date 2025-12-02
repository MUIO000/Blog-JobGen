/**
 * Data Migration Script
 * Migrate data from blogData.json to Firebase Firestore
 * 
 * Usage:
 * 1. Ensure Firebase is configured (src/firebase/config.js)
 * 2. Run: node scripts/migrate-to-firebase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read blogData.json
const blogDataPath = join(__dirname, '../src/data/blogData.json');
const blogData = JSON.parse(readFileSync(blogDataPath, 'utf-8'));

async function migrateData() {
  console.log('🚀 Starting data migration to Firebase Firestore...\n');

  try {
    // Use batch processing for better performance
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore batch limit

    // 1. Migrate Categories
    console.log('📁 Migrating categories data...');
    for (const category of blogData.categories) {
      const categoryRef = doc(db, 'categories', category.id);
      batch.set(categoryRef, category);
      batchCount++;
      
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        batchCount = 0;
      }
    }
    console.log(`   ✓ Migrated ${blogData.categories.length} categories\n`);

    // 2. Migrate Timeline
    console.log('⏱️  Migrating timeline data...');
    for (const phase of blogData.timeline) {
      const phaseRef = doc(db, 'timeline', phase.id);
      batch.set(phaseRef, phase);
      batchCount++;
      
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        batchCount = 0;
      }
    }
    console.log(`   ✓ Migrated ${blogData.timeline.length} timeline phases\n`);

    // 3. Migrate Articles
    console.log('📝 Migrating articles data...');
    for (const article of blogData.articles) {
      const articleRef = doc(db, 'articles', article.id);
      batch.set(articleRef, article);
      batchCount++;
      
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        batchCount = 0;
      }
    }
    console.log(`   ✓ Migrated ${blogData.articles.length} articles\n`);

    // Commit remaining batch
    if (batchCount > 0) {
      await batch.commit();
    }

    console.log('✅ Data migration completed!');
    console.log(`\n📊 Migration summary:`);
    console.log(`   - Categories: ${blogData.categories.length}`);
    console.log(`   - Timeline phases: ${blogData.timeline.length}`);
    console.log(`   - Articles: ${blogData.articles.length}`);
    console.log('\n🎉 You can now view the data in Firebase Console!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nPlease check:');
    console.error('1. Firebase configuration is correct');
    console.error('2. Firestore database has been created');
    console.error('3. Network connection is working');
    process.exit(1);
  }
}

// Run migration
migrateData();

