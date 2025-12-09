import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/user";

export async function GET() {
  const cu = await currentUser();
  if (!cu) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: cu.id }).lean();
  if (!user) return new Response("Not found", { status: 404 });

  return Response.json(user);
}
