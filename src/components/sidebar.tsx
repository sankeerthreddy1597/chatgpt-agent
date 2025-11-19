"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Brain,
  LogOut,
  Search,
  Settings,
  SquarePen,
  Ellipsis,
  Pencil,
  Trash2,
  Cable,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { Sidebar as SideBar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export function Sidebar() {
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const pathname = usePathname();

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (!res.ok) throw new Error("Failed to fetch chats");
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error(error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

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

  const handleNewChat = async () => {
    try {
      const res = await fetch("/api/chats/new", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to create chat");

      const chat = await res.json();
      router.push(`/chat/${chat.id}`);
      setTimeout(fetchChats, 500);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Error creating new chat!");
    }
  };

  return (
    <SideBar>
      <aside className="h-screen md:w-64 flex flex-col bg-muted/60 border-r">
        <div className="flex gap-2 items-center p-4">
          <Brain className="h-8 w-8 text-green-400" />
          <span className="text-lg font-semibold tracking-tight">
            ChatGPT Agent
          </span>
        </div>
        {/* Top: New Chat Button */}
        <div className="p-4 border-b border-muted-foreground/20">
          <Button
            className="w-full justify-start hover:bg-muted-foreground/20 cursor-pointer"
            variant="ghost"
            onClick={handleNewChat}
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

          <Link href={'/integrations'}>
          <Button
            className={cn(
              "w-full justify-start cursor-pointer",
              pathname === '/integrations' ?
                "bg-muted-foreground/20 text-foreground font-medium hover:bg-muted-foreground/20"
                : "hover:bg-muted-foreground/20"
            )}
            variant={"ghost"}
          >
             <Cable className="w-4 h-4 mr-2" />
            Integrations
          </Button>
           </Link>
        </div>

        {/* Middle: Chat history */}
        <ScrollArea className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            <p className="px-3 text-xs font-medium text-muted-foreground">
              Chats
            </p>
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-8 w-full rounded-md mb-4" />
                ))
              : chats?.map((chat) => {
                  const isActive = pathname === `/chat/${chat.id}`;

                  const handleRenameClick = (
                    chatId: string,
                    currentTitle: string
                  ) => {
                    setEditingChatId(chatId);
                    setNewTitle(currentTitle);
                  };

                  const handleRenameSave = async (chatId: string) => {
                    try {
                      if (newTitle.trim() === "") return;
                      await fetch(`/api/chats/${chatId}`, {
                        method: "PUT",
                        body: JSON.stringify({ title: newTitle }),
                        headers: { "Content-Type": "application/json" },
                      });

                      setChats((prev) => {
                        return prev?.map((chat) =>
                          chat.id === chatId
                            ? { ...chat, title: newTitle }
                            : chat
                        );
                      });
                    } catch (err) {
                      console.error("Rename failed", err);
                    } finally {
                      setEditingChatId(null);
                    }
                  };

                  return (
                    <div
                      key={chat.id}
                      className={cn(
                        "group/chat flex items-center justify-between px-3 py-2 rounded-md text-sm transition",
                        isActive
                          ? "bg-muted-foreground/20 text-foreground font-medium"
                          : "hover:bg-muted-foreground/20"
                      )}
                    >
                      {editingChatId === chat.id ? (
                        <Input
                          autoFocus
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => handleRenameSave(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleRenameSave(chat.id);
                            }
                          }}
                          className="h-8 text-sm px-2 bg-white"
                        />
                      ) : (
                        <Link
                          href={`/chat/${chat.id}`}
                          className="flex-1 truncate"
                        >
                          {chat.title}
                        </Link>
                      )}

                      {/* Show only on individual chat hover */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="md:opacity-0 opacity-100 group-hover/chat:opacity-100 data-[state=open]:opacity-100 p-1 rounded-md transition cursor-pointer">
                            <Ellipsis className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" className="w-32">
                          <DropdownMenuItem
                            onClick={() =>
                              handleRenameClick(chat.id, chat.title)
                            }
                            className="cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-gray-800" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            // onClick={() => handleDeleteChat(chat.id)}
                            className="text-red-500 focus:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 focus:text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
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
    </SideBar>
  );
}
