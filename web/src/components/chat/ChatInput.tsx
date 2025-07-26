"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "../ui/loader";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSendMessage,
  disabled,
  isLoading,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Mencegah baris baru saat menekan Enter
      if (!disabled) onSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 rounded-full bg-secondary p-2 shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-ring">
        <Input
          value={value}
          onChange={onChange}
          placeholder="Enter Youtube Url ..."
          className="w-full text-base bg-transparent border-none shadow-none p-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={onSendMessage}
          className="rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={disabled}
          aria-label="Summarize"
        >
          {isLoading ? (
            <LoaderCircle className="w-5 h-5" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground mt-4 leading-relaxed">
        HADE may make mistakes. We recommend checking important information.{" "}
        <button className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
          Privacy Notice
        </button>
      </div>
    </div>
  );
}
