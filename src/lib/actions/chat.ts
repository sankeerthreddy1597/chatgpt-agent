"use server";

import { prisma as db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the most recent chat or create one if none exists.
 */
export async function getOrCreateFirstChat(userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    let chat = await db.chat.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!chat) {
      chat = await db.chat.create({
        data: {
          userId,
          title: "New Chat",
        },
      });
    }

    return chat;
  } catch (error) {
    console.error("Error in getOrCreateFirstChat:", error);
    throw error;
  }
}

/**
 * Create a brand new chat.
 */
export async function createNewChat(userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const chat = await db.chat.create({
      data: {
        userId,
        title: "New Chat",
      },
    });

    return chat;
  } catch (error) {
    console.error("Error in createNewChat:", error);
    throw error;
  }
}

/**
 * Get all chats for a user.
 */
export async function getAllChats(userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const chats = await db.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return chats;
  } catch (error) {
    console.error("Error in getAllChats:", error);
    throw error;
  }
}

/**
 * Get a specific chat by ID, only if it belongs to the user.
 */
export async function getChatById(chatId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const chat = await db.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!chat || chat.userId !== session.user.id) {
      throw new Error("Chat not found or access denied");
    }

    return chat;
  } catch (error) {
    console.error("Error in getChatById:", error);
    throw error;
  }
}

/**
 * Update the title of a specific chat, if it belongs to the user.
 */
export async function updateChatTitle(chatId: string, newTitle: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const chat = await db.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== session.user.id) {
      throw new Error("Chat not found or access denied");
    }

    const updatedChat = await db.chat.update({
      where: { id: chatId },
      data: { title: newTitle },
    });

    return updatedChat;
  } catch (error) {
    console.error("Error in updateChatTitle:", error);
    throw error;
  }
}

/**
 * Delete a specific chat if it belongs to the user.
 */
export async function deleteChat(chatId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const chat = await db.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== session.user.id) {
      throw new Error("Chat not found or access denied");
    }

    const deleted = await db.chat.delete({
      where: { id: chatId },
    });

    return deleted;
  } catch (error) {
    console.error("Error in deleteChat:", error);
    throw error;
  }
}
