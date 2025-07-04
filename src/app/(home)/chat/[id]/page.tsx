import React from 'react';
import { getChatById } from '@/lib/actions/chat';
import ChatPage from '@/components/ChatPage';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

// Define your types to match your database schema
interface DatabaseMessage {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT'; // From your Role enum
  createdAt: Date;
  metadata?: any;
  chatId: string;
}

interface DatabaseChat {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: DatabaseMessage[];
}

// Component expected format
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default async function ChatPageRoute({ params }: PageProps) {
  const { id } = params;

  try {
    // Fetch chat data from your database
    const chat = await getChatById(id) as DatabaseChat;
    
    if (!chat) {
      // Redirect to home or show 404
      redirect('/');
    }

    // Transform your database messages to match the component's expected format
    const transformedMessages: Message[] = chat.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role.toLowerCase() as 'user' | 'assistant', // Convert 'USER'/'ASSISTANT' to lowercase
      timestamp: msg.createdAt
    }));

    return <ChatPage chatId={id} initialMessages={transformedMessages} />;
  } catch (error) {
    console.error('Error fetching chat:', error);
    redirect('/');
  }
}

// Optional: Add metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = params;
  
  try {
    const chat = await getChatById(id) as DatabaseChat;
    return {
      title: chat?.title || 'Chat',
      description: 'AI Chat Conversation',
    };
  } catch (error) {
    return {
      title: 'Chat',
      description: 'AI Chat Conversation',
    };
  }
}