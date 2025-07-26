"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoInfo } from "@/components/chat/VideoInfo";
import { SummarySection } from "@/components/chat/SummarySection";

interface VideoMetadata {
  title: string;
  thumbnail: string;
  channel: string;
}

interface ResultDisplayProps {
  summary: string;
  isLoading: boolean;
  error: string;
  videoInfo: VideoMetadata | null;
  videoUrl: string;
}

export function ResultDisplay({
  isLoading,
  error,
  summary,
  videoInfo,
  videoUrl,
}: ResultDisplayProps) {
  if (!isLoading && !error && !summary) {
    return null;
  }
  return (
    <div className="h-full">
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
      {summary && videoInfo && (
        <div className="h-full max-w-7xl mx-auto p-4 sm:p-8">
          <div className="grid h-full grid-cols-1 lg:grid-cols-2 gap-12 lg:grid-rows-[minmax(0,1fr)]">
            {/* Kolom Kiri: Info Video */}
            <div className="space-y-6">
              <VideoInfo
                title={videoInfo.title}
                channel={videoInfo.channel}
                videoUrl={videoUrl}
              />
            </div>

            {/* Kolom Kanan: Ringkasan */}
            <div className="relative">
              <ScrollArea className="absolute inset-0">
                <div className="space-y-8 pr-4">
                  <SummarySection summary={summary} />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
