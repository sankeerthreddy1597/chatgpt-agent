"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { FaGithub, FaGoogle } from "react-icons/fa";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export const SignInOauthButton = ({
  provider,
  signUp,
}: SignInOauthButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);

    await signIn.social({
      provider,
      callbackURL: '/',
      errorCallbackURL: '/auth'
    });

    setIsPending(false);
  }

  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "GitHub";

  return (
    <Button onClick={handleClick} disabled={isPending} className="cursor-pointer" variant={'outline'}>
        {provider === "google" ? <FaGoogle className="h-6 w-6" /> : <FaGithub className="h-6 w-6"/>}
      Sign {action} with {providerName}
    </Button>
  );
};