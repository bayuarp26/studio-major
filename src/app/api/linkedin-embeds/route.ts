import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

interface LinkedInEmbedData {
  _id?: ObjectId;
  id?: string;
  title: string;
  description: string;
  embedUrl: string;
  category: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  likes: number;
  comments: number;
  shares: number;
}

async function connectToDatabase() {
  await client.connect();
  return client.db('portfolioDB');
}

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<LinkedInEmbedData>('linkedinEmbeds');
    
    const embeds = await collection
      .find({ published: true })
      .sort({ createdAt: -1 })
      .toArray();
    
    const formattedEmbeds = embeds.map(embed => ({
      ...embed,
      id: embed._id?.toString() || embed.id,
    }));
    
    return NextResponse.json(formattedEmbeds);
  } catch (error) {
    console.error('Error fetching LinkedIn embeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn embeds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.embedUrl || !data.title) {
      return NextResponse.json(
        { error: 'Embed URL and title are required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection<LinkedInEmbedData>('linkedinEmbeds');
    
    const now = new Date();
    const embedData: Omit<LinkedInEmbedData, '_id' | 'id'> = {
      title: data.title,
      description: data.description || '',
      embedUrl: data.embedUrl,
      category: data.category || 'LinkedIn',
      author: data.author || 'Bayu',
      createdAt: now,
      updatedAt: now,
      published: data.published !== false,
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 20) + 2,
      shares: Math.floor(Math.random() * 15) + 1,
    };
    
    const result = await collection.insertOne(embedData as any);
    
    const newEmbed = {
      id: result.insertedId.toString(),
      ...embedData,
    };
    
    return NextResponse.json(newEmbed, { status: 201 });
  } catch (error) {
    console.error('Error creating LinkedIn embed:', error);
    return NextResponse.json(
      { error: 'Failed to create LinkedIn embed' },
      { status: 500 }
    );
  }
}
