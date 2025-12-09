// app/api/product/seller-list/route.js

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import Product from '@/models/product';
import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'unauthenticated' },
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: 'not authorized' },
        { status: 403 }
      );
    }

    await connectDB();

    const products = await Product.find({ userId }).lean();

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
