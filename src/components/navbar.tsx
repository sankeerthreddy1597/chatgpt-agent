"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, Menu } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { state } = useSidebar();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  }

  return (
    <header className="border-b px-4 py-2 flex items-center justify-between bg-background w-full">
      {/* Left: Hamburger + Logo + Model Selector*/}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon">
          <SidebarTrigger className="w-5 h-5 cursor-pointer" />
        </Button>
        {state === "collapsed" && (
          <div className="md:flex gap-2 items-center hidden">
            <Brain className="h-8 w-8 text-green-400" />
            <span className="text-lg font-semibold tracking-tight">
              ChatGPT Agent
            </span>
          </div>
        )}

        <Select defaultValue="gemini-flash-2.0">
          <SelectTrigger className="h-8 px-3 py-1 text-sm border-none hover:bg-muted/80 rounded-md shadow-none focus:ring-0 focus:outline-none">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent className="w-[150px]">
            <SelectItem value="gemini-flash-2.0">Gemini Flash 2.0</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="llama3">LLaMA 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right: User Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="w-8 h-8">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-max-sm">
          <DropdownMenuItem disabled>{session?.user?.email}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>User Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={handleClick}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
