'use client'
 
import { useSearchParams } from 'next/navigation'
import { SignInOauthButton } from "@/components/sign-in-oauth-button";
import { Alert, AlertTitle } from "@/components/ui/alert"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Brain } from 'lucide-react';

export default function Page() {
    const queryParams = useSearchParams()
 
  const error = queryParams.get('error');

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-4 mb-4">
            <Brain className="h-16 w-16 text-green-400"/>
            <h2 className="text-2xl font-medium">ChatGPT Agent</h2>
        </CardTitle>
        <CardDescription>
            <h3 className='text-2xl font-medium mb-4 text-black text-center'>Login</h3>
        <hr className="max-w-md px-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 mb-4'>
      {error && (
        <Alert variant="destructive">
        <AlertTitle>Account already exists with a different provider</AlertTitle>
      </Alert>
      )}
      <div className="flex flex-col max-w-sm gap-4">
        <SignInOauthButton provider="google" />
        <SignInOauthButton provider="github" />
      </div>
      </CardContent>
    </Card>
    </div>
  )
}

