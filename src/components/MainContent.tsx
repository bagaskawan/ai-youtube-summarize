"use client";

import { useState } from "react";
import { Bot, Send, Paperclip, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MainContent() {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Noera</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            AI v1.5
          </span>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade AI
        </Button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        <div className="text-center max-w-4xl w-full">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Bot className="w-10 h-10 text-white" />
          </div>

          {/* Main Text */}
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Built to think.
          </h1>
          <p className="text-2xl text-gray-400 mb-16 font-light">
            Designed to assist.
          </p>

          {/* Centered Input Area */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full pr-24 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 shadow-lg transition-all duration-200"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 h-auto rounded-xl hover:bg-gray-100"
                >
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 h-auto rounded-xl hover:bg-gray-100"
                >
                  <Mic className="w-5 h-5 text-gray-400" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  className="p-2 h-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg"
                  disabled={!message.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-sm text-gray-500 mt-4 leading-relaxed">
              Noera may make mistakes. We recommend checking important
              information.{" "}
              <button className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Privacy Notice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
