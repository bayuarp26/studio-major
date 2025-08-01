const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolioDB';
const ADMIN_USERS_COLLECTION = 'admin_users';

async function listAdminUsers() {
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
    
    const users = await collection.find({}).toArray();
    
    console.log('\n👥 Admin Users in Database:');
    console.log('============================');
    
    if (users.length === 0) {
      console.log('❌ No admin users found.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log(`   Created: ${user.createdAt ? user.createdAt.toISOString() : 'N/A'}`);
        console.log(`   Last Login: ${user.lastLoginAt ? user.lastLoginAt.toISOString() : 'Never'}`);
        console.log('   ---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed.');
  }
}

listAdminUsers();
