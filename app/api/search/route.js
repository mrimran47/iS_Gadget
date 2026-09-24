import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    console.log("\n==============================");
    console.log("🔍 Query Received:", query);

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Check if DB actually has products
    const allProducts = await Product.find({});
    console.log("Total Products in DB:", allProducts.length);

    // 2. Print actual stored names
    console.log("Example Product Names:");
    allProducts.slice(0, 5).forEach(p => console.log("  -", p.name));

    // 3. Now build the regex search
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    };

    console.log("Search Criteria:", searchCriteria);

    // 4. Perform search
    const foundProducts = await Product.find(searchCriteria);

    console.log("Products Found:", foundProducts.length);
    console.log("==============================\n");

    return NextResponse.json(foundProducts, { status: 200 });

  } catch (err) {
    console.error("SEARCH API ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
