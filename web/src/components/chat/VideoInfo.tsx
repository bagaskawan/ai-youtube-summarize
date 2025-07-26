"use client";

interface VideoInfoProps {
  title: string;
  channel: string;
  videoUrl: string;
}

// Helper function to extract YouTube video ID
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

export function VideoInfo({ title, channel, videoUrl }: VideoInfoProps) {
  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="space-y-6">
      {/* Video Thumbnail */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <p className="text-gray-500">Invalid YouTube URL</p>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{channel}</p>
      </div>
    </div>
  );
}
