"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Copy, ThumbsUp, ThumbsDown, Plus, ArrowUp, Volume2, Mic, Settings2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Types
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatPageProps {
  chatId: string;
  initialMessages?: Message[];
}

const ChatPage: React.FC<ChatPageProps> = ({
  chatId,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };
  
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInputMessage("");
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        body: JSON.stringify({ chatId, userMessage: inputMessage }),
      });
  
      if (!res.body) throw new Error("No response body");
  
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
  
      let chunkText = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const text = decoder.decode(value);
        chunkText += text;
  
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + text }
              : msg
          )
        );
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error("Streaming failed", error);
      setIsLoading(false);
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {!hasMessages ? (
        /* Empty State - Centered Layout */
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              How can I help you today?
            </h1>
            <p className="text-gray-600">
              Start a conversation by typing your message below
            </p>
          </div>

          {/* Suggested Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-3xl">
            {[
              "Help me plan a weekend trip to Paris",
              "Create a workout routine for beginners",
            ].map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(prompt)}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-white transition-colors"
              >
                <span className="text-gray-700">{prompt}</span>
              </button>
            ))}
          </div>

          {/* Input Area - Centered */}
          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="w-full min-h-[52px] max-h-[200px] p-4 pl-6 pb-12 pr-12 border border-gray-300 rounded-[28px] resize-none focus:outline-none shadow-sm"
                rows={2}
                disabled={isLoading}
              />
              <button
                disabled={isLoading}
                className="absolute left-4 bottom-4 w-8 h-8 hover:bg-muted-foreground/60 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5 text-gray-800" />
              </button>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-4 bottom-4 w-8 h-8 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-2">
              ChatGPT can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </div>
      ) : (
        /* Messages View - Split Layout */
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto pb-4">
            <div className="max-w-3xl mx-auto w-full px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-8 ${message.role === "user" ? "ml-auto" : ""}`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-1 ${
                        message.role === "user" ? "flex justify-end" : ""
                      }`}
                    >
                      <div
                        className={`max-w-none ${
                          message.role === "user"
                            ? "bg-gray-100 rounded-lg p-4"
                            : ""
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {message.role === "user" && message.content}
                            {message.role === "assistant" && (
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            )}
                          </p>
                        </div>

                        {message.role === "assistant" && message.content && (
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                              title="Copy message"
                            >
                              <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                              title="Good response"
                            >
                              <ThumbsUp className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                              title="Bad response"
                            >
                              <ThumbsDown className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                              title="Read aloud"
                            >
                              <Volume2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <span className="text-xs text-gray-400 ml-2">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Bottom */}
          <div>
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="w-full min-h-[52px] max-h-[200px] p-4 pl-6 pb-12 pr-12 border border-gray-300 rounded-[28px] resize-none focus:outline-none shadow-md"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  disabled={isLoading}
                  className="absolute left-4 bottom-4 w-8 h-8 hover:bg-muted-foreground/20 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  disabled={isLoading}
                  className="absolute left-18 bottom-4 w-8 h-8 flex items-center justify-center"
                >
                  <div className="flex items-center justify-center gap-x-1 hover:bg-muted-foreground/20 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors cursor-pointer p-2">
                  <Settings2 className="w-5 h-5 text-gray-700" />
                  <span className="text-sm">Tools</span>
                  </div>
                </button>
                <button
                  disabled={isLoading}
                  className="absolute right-14 bottom-4 w-8 h-8 hover:bg-muted-foreground/20 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Mic className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-4 bottom-4 w-8 h-8 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                >
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-2">
                AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
