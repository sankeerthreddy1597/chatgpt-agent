import {auth} from "@/lib/auth"
import { headers } from "next/headers";

import { getAllChats } from "@/lib/actions/chat";

export async function GET() {
  try {
     const session = await auth.api.getSession({ headers: await headers() });
     if (!session) {
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }
      }

    const chats = await getAllChats(session.user.id);
    return Response.json(chats);
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Something Went Wrong! Please try again." }), { status: 500 });
  }
}
