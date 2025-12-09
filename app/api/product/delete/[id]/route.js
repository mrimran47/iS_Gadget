// app/api/product/delete/[id]/route.js

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Product from '@/models/product';
import authSeller from '@/lib/authSeller';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    await connectDB();

    // Verify product belongs to this seller
    const product = await Product.findOne({ _id: id, userId });
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    await Product.deleteOne({ _id: id });

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
