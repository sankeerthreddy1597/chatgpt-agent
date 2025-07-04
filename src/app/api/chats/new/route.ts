import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createNewChat } from "@/lib/actions/chat";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const chat = await createNewChat(session.user.id);

    return NextResponse.json(chat);
  } catch (e) {
    console.error("Failed to create chat:", e);
    return new NextResponse(JSON.stringify({ error: "Failed to create chat" }), { status: 500 });
  }
}
