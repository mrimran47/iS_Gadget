// /app/api/address/get-address/route.js (Improved)

import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

       
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        await connectDB();
        
       
        const addresses = await Address.find({ userId: userId }); 
        
        return NextResponse.json({ success: true, addresses });
        
    } catch (error) {
        console.error("GET Address API Error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}