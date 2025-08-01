const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolioDB';
const ADMIN_USERS_COLLECTION = 'admin_users';

async function activateUser() {
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
    
    // Check if user exists
    const existingUser = await collection.findOne({ username });
    
    if (!existingUser) {
      console.log(`❌ User '${username}' tidak ditemukan.`);
      return;
    }
    
    console.log(`👤 User ditemukan: ${username}`);
    console.log(`   Status saat ini: ${existingUser.isActive ? 'Aktif' : 'Tidak Aktif'}`);
    
    // Update user to activate and fix missing fields
    const updateResult = await collection.updateOne(
      { username },
      { 
        $set: { 
          isActive: true,
          role: existingUser.role || 'admin', // Set default role if missing
          email: existingUser.email || `${username}@example.com`, // Set default email if missing
          updatedAt: new Date(),
          createdAt: existingUser.createdAt || new Date() // Set createdAt if missing
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ User berhasil diaktifkan dan diperbaiki!');
      
      // Show updated user info
      const updatedUser = await collection.findOne({ username });
      console.log('\n📋 Data user setelah update:');
      console.log(`   Username: ${updatedUser.username}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Role: ${updatedUser.role}`);
      console.log(`   Active: ${updatedUser.isActive ? '✅' : '❌'}`);
      console.log(`   Created: ${updatedUser.createdAt ? updatedUser.createdAt.toISOString() : 'N/A'}`);
      console.log(`   Updated: ${updatedUser.updatedAt ? updatedUser.updatedAt.toISOString() : 'N/A'}`);
      
      console.log('\n🔐 Login credentials:');
      console.log(`   Username: ${username}`);
      console.log('   Password: [Perlu diset jika belum ada]');
      console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
      
    } else {
      console.log('⚠️ Tidak ada perubahan dilakukan.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed.');
  }
}

activateUser();
