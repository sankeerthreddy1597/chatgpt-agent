"use client"

import { SignOutButton } from "@/components/sign-out-button"
import { useSession } from "@/lib/auth-client";
import { Brain, LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";



export default function Home() {
  const { data: session, isPending } = useSession();

  if(isPending) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Brain className="h-20 w-20 text-green-400"/>
        <h2 className="text-2xl font-medium">ChatGPT Agent</h2>
      </div>
      <LoaderCircle className="h-10 w-10 animate-spin text-gray-700"/>
      <h4 className="text-xl font-medium text-gray-700">Loading...</h4>
      </div>
    );
  }

  if(!session) redirect('/auth')

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
       <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
      <SignOutButton />
    </div>
  );
}
