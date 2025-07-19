"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Tambahkan logika untuk mengirim pesan ke API di sini
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Mencegah baris baru saat menekan Enter
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 rounded-full bg-secondary p-2 shadow-lg transition-all duration-200 focus-within:ring-2 ">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Youtube Url ..."
          className="w-full text-base bg-transparent border-none shadow-none p-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={handleKeyPress}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          className="rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!message.trim()}
        >
          <Zap className="w-5 h-5" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground mt-4 leading-relaxed">
        Noera may make mistakes. We recommend checking important information.{" "}
        <button className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
          Privacy Notice
        </button>
      </div>
    </div>
  );
}
