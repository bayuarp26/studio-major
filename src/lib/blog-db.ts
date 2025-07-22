import { MongoClient, ObjectId } from 'mongodb';
import { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from './blog-types';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('portfolioDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function createBlogPost(input: CreateBlogPostInput): Promise<BlogPost> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const now = new Date();
  const post: Omit<BlogPost, 'id'> = {
    ...input,
    createdAt: now,
    updatedAt: now,
    likes: 0,
    comments: 0,
    shares: 0,
  };
  
  const result = await collection.insertOne(post as any);
  
  return {
    id: result.insertedId.toString(),
    ...post,
  };
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const query = collection
    .find({ published: true })
    .sort({ createdAt: -1 });
    
  if (limit) {
    query.limit(limit);
  }
  
  const posts = await query.toArray();
  
  return posts.map(post => ({
    ...post,
    id: post._id?.toString() || post.id,
  }));
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const posts = await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  
  return posts.map(post => ({
    ...post,
    id: post._id?.toString() || post.id,
  }));
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const post = await collection.findOne({ _id: new ObjectId(id) });
  
  if (!post) return null;
  
  return {
    ...post,
    id: post._id?.toString() || post.id,
  };
}

export async function updateBlogPost(input: UpdateBlogPostInput): Promise<BlogPost | null> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const { id, ...updateData } = input;
  
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  
  if (!result) return null;
  
  return {
    ...result,
    id: result._id?.toString() || result.id,
  };
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
  return result.deletedCount > 0;
}

export async function toggleBlogPostPublished(id: string): Promise<BlogPost | null> {
  const db = await connectToDatabase();
  const collection = db.collection<BlogPost>('blogPosts');
  
  const post = await collection.findOne({ _id: new ObjectId(id) });
  if (!post) return null;
  
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        published: !post.published,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  
  if (!result) return null;
  
  return {
    ...result,
    id: result._id?.toString() || result.id,
  };
}
