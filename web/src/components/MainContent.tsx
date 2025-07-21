"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { WelcomeMessage } from "./chat/WelcomeMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle } from "@/components/ui/loader";
import { useState } from "react";

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
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: url }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
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
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <LoaderCircle className="animate-spin" />
              <span>Generating summary...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : summary ? (
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: summary.replace(/•/g, "<br/>•"),
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatHeader />

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        <div className="text-center max-w-4xl w-full">
          <WelcomeMessage />
          <ChatInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onClick={handleSendMessage}
            isLoading={isLoading}
            disabled={!url.trim() || isLoading}
          />
        </div>
        {(isLoading || error || summary) && <ResultDisplay />}
      </main>
    </div>
  );
}
