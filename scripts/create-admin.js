const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolioDB';
const ADMIN_USERS_COLLECTION = 'admin_users';

async function createAdminUser() {
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
    
    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('admin', 12);
    
    // Check if admin user already exists
    const existingUser = await collection.findOne({ username: 'admin' });
    
    if (existingUser) {
      console.log('👤 Admin user already exists. Updating...');
      await collection.updateOne(
        { username: 'admin' },
        { 
          $set: { 
            password: hashedPassword,
            isActive: true,
            updatedAt: new Date()
          } 
        }
      );
      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('➕ Creating new admin user...');
      await collection.insertOne({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin');
    console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed.');
  }
}

createAdminUser();
