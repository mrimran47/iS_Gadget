// app/api/me/sync/route.js
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/user";

export async function POST() {
  const cu = await currentUser();
  if (!cu) return new Response("Unauthorized", { status: 401 });

  const primaryEmail =
    cu.emailAddresses?.find(e => e.id === cu.primaryEmailAddressId)?.emailAddress || cu.emailAddresses?.[0]?.emailAddress || "";

  await connectDB();

  await User.findOneAndUpdate(
    { clerkId: cu.id },
    {
      $setOnInsert: { cartItems: {} },
      $set: {
        email: primaryEmail,
        name: `${cu.firstName ?? ""} ${cu.lastName ?? ""}`.trim() || cu.username || "Unknown",
        imageUrl: cu.imageUrl || "",
      },
    },
    { upsert: true, new: true }
  );

  return Response.json({ ok: true });
}
