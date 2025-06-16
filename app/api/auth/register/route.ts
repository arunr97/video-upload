import { dbConnect } from '@/lib/db';
import User from '@/models/Users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const registeredUser = await User.create({ email, password });

    return NextResponse.json(
      { message: 'User registered successfully', user: registeredUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('🔴Error in registration:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
