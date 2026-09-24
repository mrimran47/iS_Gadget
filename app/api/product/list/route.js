// app/api/product/list/route.js

import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectDB from '@/config/db';

export async function GET(req) {
 try {
//  Connect to the database
await connectDB();

   
    const { searchParams } = new URL(req.url);
    
    const categoryFilter = searchParams.get('category') || '';
   
    const priceMin = parseFloat(searchParams.get('priceMin')) || 0;
    const priceMax = parseFloat(searchParams.get('priceMax')) || 999999; 

   
    let dbQuery = {};

    // Filter by Category
    if (categoryFilter) {
        
        dbQuery.category = { $regex: categoryFilter, $options: 'i' };
    }
    
    
    if (priceMin > 0 || priceMax < 999999) {
    dbQuery.offerPrice = { 
        $gte: priceMin, 
        $lte: priceMax  
    };
}
    
   

 const products = await Product.find(dbQuery).lean(); 

 return NextResponse.json(
 { success: true, products },
{ status: 200 }
 );

 } catch (err) {
 return NextResponse.json(
{ success: false, message: err.message || 'Server error' },
 { status: 500 }
);
}
}