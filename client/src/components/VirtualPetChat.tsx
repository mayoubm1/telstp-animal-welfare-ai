import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "pet" | "owner";
  content: string;
  timestamp: Date;
}

interface VirtualPetChatProps {
  petName: string;
  onSendMessage?: (message: string) => Promise<string>;
  isLoading?: boolean;
  language?: "en" | "ar";
}

export const VirtualPetChat: React.FC<VirtualPetChatProps> = ({
  petName,
  onSendMessage,
  isLoading = false,
  language = "en",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "pet",
      content: `Hi! I'm ${petName}. How can I help you today? 🐾`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "owner",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsWaitingForResponse(true);

    try {
      if (onSendMessage) {
        const petResponse = await onSendMessage(inputValue);
        const petMessage: ChatMessage = {
          role: "pet",
          content: petResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, petMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "pet",
        content: "Sorry, I'm thinking... 🤔",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isRTL = language === "ar";

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-b from-purple-900 to-indigo-900 rounded-lg p-4 space-y-4 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      {/* Chat Header */}
      <div className="text-center pb-4 border-b border-purple-700">
        <h3 className="text-xl font-bold text-white">
          {language === "ar" ? "دردشة مع" : "Chat with"} {petName} 💬
        </h3>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "owner" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === "owner"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-purple-700 text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isWaitingForResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-purple-700 text-white px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === "ar" ? "اكتب رسالتك..." : "Type your message..."}
          disabled={isWaitingForResponse || isLoading}
          className="flex-1 bg-purple-800 border-purple-600 text-white placeholder-purple-400"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isWaitingForResponse || isLoading || !inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isWaitingForResponse || isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
