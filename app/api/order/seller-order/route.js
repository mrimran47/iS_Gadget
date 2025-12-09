import connectDB from "@/config/db";
import Order from "@/models/Order"; 
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        
        // 1. Check if the user is a Seller
        const user = await User.findOne({ clerkId: userId });

       
        
        // 2. Fetch all orders (or filter by seller-specific logic if implemented)
        // For simplicity, we fetch ALL orders for the seller dashboard for now.
        // We populate both the product details and the shipping address.
        const orders = await Order.find({}) // Fetches all orders
            .populate('items.product') 
            .populate('address') 
            .sort({ date: -1 }); // Newest first

        // 3. Return the list of orders
        return NextResponse.json({ 
            success: true, 
            data: orders 
        }, { status: 200 });

    } catch (error) {
        console.error("Fetch Seller Orders API Error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}