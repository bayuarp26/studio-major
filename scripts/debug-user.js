const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolioDB';
const ADMIN_USERS_COLLECTION = 'admin_users';

async function debugUser() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan di .env.local');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(ADMIN_USERS_COLLECTION);
    
    const username = '085156453246';
    const testPassword = 'wahyu-58321';
    
    // Get user data
    const user = await collection.findOne({ username });
    
    if (!user) {
      console.log(`❌ User '${username}' tidak ditemukan.`);
      return;
    }
    
    console.log('👤 User Data:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`);
    console.log(`   Password Hash: ${user.password ? user.password.substring(0, 20) + '...' : 'N/A'}`);
    
    if (user.password) {
      console.log('\n🔍 Testing password...');
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`   Password '${testPassword}' is: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      
      // Test with different common passwords
      const testPasswords = ['wahyu-58321', '123456', 'admin', 'password'];
      console.log('\n🔍 Testing common passwords:');
      for (const pwd of testPasswords) {
        const isValidTest = await bcrypt.compare(pwd, user.password);
        console.log(`   '${pwd}': ${isValidTest ? '✅ Valid' : '❌ Invalid'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed.');
  }
}

debugUser();
