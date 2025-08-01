const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolioDB';
const ADMIN_USERS_COLLECTION = 'admin_users';

async function updatePassword() {
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
    const correctPassword = 'wahyu-58321';
    
    // Check if user exists
    const existingUser = await collection.findOne({ username });
    
    if (!existingUser) {
      console.log(`❌ User '${username}' tidak ditemukan.`);
      return;
    }
    
    console.log(`👤 Updating password untuk user: ${username}`);
    console.log(`🔐 Password baru: ${correctPassword}`);
    
    // Hash the correct password
    console.log('🔒 Hashing password dengan bcrypt...');
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    // Update user password
    const updateResult = await collection.updateOne(
      { username },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ Password berhasil diupdate!');
      
      console.log('\n🔐 Login credentials yang benar:');
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${correctPassword}`);
      console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
      
      // Verify the password works
      console.log('\n🔍 Verifying password...');
      const isPasswordValid = await bcrypt.compare(correctPassword, hashedPassword);
      console.log(`   Password verification: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
      
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

updatePassword();
