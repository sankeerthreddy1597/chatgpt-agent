"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, Search, Settings, SquarePen } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Sidebar() {
  //   const { data: session } = useSession();

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  // Dummy chat titles for now
  const chats = [
    { id: "1", title: "Brainstorm ideas" },
    { id: "2", title: "Learn TypeScript" },
    { id: "3", title: "Write blog post" },
  ];

  return (
    <aside className="h-screen w-64 flex flex-col bg-muted/60 border-r">
      <div className="flex gap-2 items-center p-4">
        <Brain className="h-8 w-8 text-green-400" />
        <span className="text-lg font-semibold tracking-tight hidden md:inline">
          ChatGPT Agent
        </span>
      </div>
      {/* Top: New Chat Button */}
      <div className="p-4 border-b border-muted-foreground/20">
        <Button
          className="w-full justify-start hover:bg-muted-foreground/20 cursor-pointer"
          variant="ghost"
        >
          <SquarePen className="w-4 h-4 mr-2" />
          New Chat
        </Button>

        <Button
          className="w-full justify-start hover:bg-muted-foreground/20 cursor-pointer"
          variant="ghost"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Chats
        </Button>
      </div>

      {/* Middle: Chat history */}
      <ScrollArea className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          <p className="px-3 text-xs font-medium text-muted-foreground">
            Chats
          </p>
          {chats.map((chat) => (
            <Link
              href={`/home/chat/${chat.id}`}
              key={chat.id}
              className="block text-sm px-3 py-2 rounded-md hover:bg-muted-foreground/20 transition"
            >
              {chat.title}
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom: User Settings + Logout */}
      <div className="p-4 border-t border-muted-foreground/20 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-muted-foreground/20 cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-muted-foreground/20 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
