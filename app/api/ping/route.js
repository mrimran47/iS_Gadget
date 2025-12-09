import connectDB from "@/config/db";

export async function GET() {
  await connectDB();
  return Response.json({ ok: true });
}
