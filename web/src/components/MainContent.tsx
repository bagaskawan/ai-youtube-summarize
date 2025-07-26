"use client";

import { useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { WelcomeMessage } from "./chat/WelcomeMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ResultDisplay } from "@/components/chat/ResultDisplay";

interface VideoMetadata {
  title: string;
  thumbnail: string;
  channel: string;
}

export default function MainContent() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError("");
    setSummary("");
    setVideoInfo(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: url }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "An unexpected error occurred.");
      }

      const data = await response.json();
      setSummary(data.summary);
      setVideoInfo({
        title: data.title,
        thumbnail: data.thumbnail,
        channel: data.channel,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader />

      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          {!isLoading && !error && !summary && (
            <div className="h-full flex flex-col items-center justify-center">
              <WelcomeMessage />
            </div>
          )}

          {/* Komponen hasil akan muncul di sini */}
          <ResultDisplay
            summary={summary}
            isLoading={isLoading}
            error={error}
            videoInfo={videoInfo}
            videoUrl={url}
          />
        </div>
      </main>

      {/* Footer dengan Input Form */}
      <footer className="p-4 sm:p-8 sticky bottom-0 bg-background/80 backdrop-blur-sm">
        <ChatInput
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!url.trim() || isLoading}
        />
      </footer>
    </div>
  );
}
