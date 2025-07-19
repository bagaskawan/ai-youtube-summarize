"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { WelcomeMessage } from "./chat/WelcomeMessage";
import { ChatInput } from "@/components/chat/ChatInput";

export default function MainContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatHeader />

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        <div className="text-center max-w-4xl w-full">
          <WelcomeMessage />
          <ChatInput />
        </div>
      </main>
    </div>
  );
}
