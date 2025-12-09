import connectDB from "@/config/db";
import Order from "@/models/Order"; 
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        
        const orders = await Order.find({ userId: userId })
            .populate('items.product') 
            .populate('address')
            
            .sort({ date: -1 });

        return NextResponse.json({ 
            success: true, 
            data: orders 
        }, { status: 200 });

    } catch (error) {
        console.error("Fetch Orders API Error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}