import React from 'react'
import { BiLogoGmail } from "react-icons/bi";
import { FaGoogleDrive } from "react-icons/fa";
import { FaSlack } from "react-icons/fa6";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

const integrations = [
    {
        id: '1',
        title: "Gmail",
        description: 'Read emails and create draft emails.',
        icon: BiLogoGmail,
        connected: false,
    },
    {
        id: '2',
        title: "Google Drive",
        description: 'Read and write to google drive.',
        icon: FaGoogleDrive,
        connected: false,
    },
    {
        id: '3',
        title: "Slack",
        description: 'Read and write messages from slack.',
        icon: FaSlack,
        connected: true,
    }
]

const Integrations = () => {
  return (
    <div className="p-3 px-8">
        <span className='text-4xl font-medium mb-2'>Integrations</span>
        <div className='flex-col justify-center items-center gap-y-2'>
            {integrations.map((connection) => 
            <Card key={connection.id} className='my-2'>
                <CardHeader>
                    <CardTitle>
                        <div className='flex gap-2 items-center'>
                            <connection.icon className='h-8 w-8'/>
                            {connection.title}
                        </div>
                    </CardTitle>
                    <CardDescription>{connection.description}</CardDescription>
                    <CardAction>
                        <Button 
                            className={cn(
                                "bg-green-500 hover:bg-green-500/90 cursor-pointer",
                                connection.connected ? "bg-red-400 hover:bg-red-400/90" : ""
                            )}
                        >{connection.connected ? "Disconnect" : "Connect"}</Button>
                    </CardAction>
                </CardHeader>
            </Card>
            )}
        </div>
    </div>
  )
}

export default Integrations