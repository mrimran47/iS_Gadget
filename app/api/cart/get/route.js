import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        await connectDB();
        
        // 1. Find the user
        const user = await User.findOne({ clerkId: userId });

        // 2. Return the user object using the key 'user'
        // This matches the client check: if (data.user && data.user.cartItems)
        return NextResponse.json({ success: true, user }); 

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}