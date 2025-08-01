const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolioDB';
const ADMIN_USERS_COLLECTION = 'admin_users';

async function setPassword() {
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
    const newPassword = '123456'; // Default password, bisa diubah nanti
    
    // Check if user exists
    const existingUser = await collection.findOne({ username });
    
    if (!existingUser) {
      console.log(`❌ User '${username}' tidak ditemukan.`);
      return;
    }
    
    console.log(`👤 Setting password untuk user: ${username}`);
    
    // Hash the new password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
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
      console.log('✅ Password berhasil diset!');
      
      console.log('\n🔐 Login credentials:');
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${newPassword}`);
      console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
      console.log('\n⚠️  PENTING: Segera ubah password setelah login pertama!');
      
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

setPassword();
