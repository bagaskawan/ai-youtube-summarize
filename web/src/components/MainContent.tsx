"use client";

import { useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { WelcomeMessage } from "./chat/WelcomeMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";

export default function MainContent() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError("");
    setSummary("");
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const ResultDisplay = () => (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      {isLoading && (
        <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
          <LoaderCircle className="w-10 h-10 animate-spin" />
          <span className="text-lg">Generating summary, please wait...</span>
          <span className="text-sm">
            This may take a minute for longer videos.
          </span>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Video Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 'whitespace-pre-line' penting untuk menjaga format bullet points */}
            <p className="text-base leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Konten akan berubah berdasarkan state */}
        <div className="w-full max-w-4xl text-center">
          {/* Tampilkan pesan selamat datang HANYA jika tidak ada proses atau hasil */}
          {!isLoading && !error && !summary && <WelcomeMessage />}

          {/* Komponen hasil akan muncul di sini */}
          <ResultDisplay />
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
