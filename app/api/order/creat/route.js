import connectDB from "@/config/db";
import Order from "@/models/Order"; // The model you just created
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { addressId, amount:subTotal, items,shippingFee} = await request.json(); 

        if (!addressId || !subTotal || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Missing required order details." }, { status: 400 });
        }

        await connectDB();
        const shippingFeeValue = Number(shippingFee);
        const finalAmount = subTotal + shippingFee;

        // 1. Create the new order document
        const newOrder = await Order.create({
            userId,             // Clerk ID of the buyer
            items, 
            shippingFee: shippingFeeValue, 
            amount:finalAmount,         
            address: addressId, // MongoDB _id of the selected address
            status: 'Order Placed', // Default status
            date: Date.now(),   // Current timestamp
        });

        // 2. Find the user and clear their cart
        // 🔑 NOTE: Using findOne({ clerkId: userId }) is CRITICAL here, 
        // unlike the problematic findById(userId) in your other APIs.
        const user = await User.findOne({ clerkId: userId });
        
        if (user) {
            user.cartItems = {}; // Clear the cart
            await user.save();   // Save the user document
        }

        return NextResponse.json({ 
            success: true, 
            message: "Order placed and cart cleared successfully",
            orderId: newOrder._id
        }, { status: 201 });

    } catch (error) {
        console.error("Create Order API Error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}