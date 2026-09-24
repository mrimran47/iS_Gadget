import connectDB from "@/config/db";
import Order from "@/models/Order"; 
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
            userId,             
            items, 
            shippingFee: shippingFeeValue, 
            amount:finalAmount,         
            address: addressId, 
            status: 'Order Placed', 
            date: Date.now(),  
        });

       
        const user = await User.findOne({ clerkId: userId });
        
        if (user) {
            user.cartItems = {}; 
            await user.save();   
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