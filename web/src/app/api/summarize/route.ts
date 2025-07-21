import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";
import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to convert audio stream to Base64
async function streamToGenerativePart(
  stream: NodeJS.ReadableStream
): Promise<Part> {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType: "audio/mp4",
    },
  };
}

export async function POST(request: Request) {
  const { videoUrl } = await request.json();

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return NextResponse.json(
      { error: "A valid YouTube URL is required" },
      { status: 400 }
    );
  }

  try {
    // =================================================================
    // RENCANA A: Coba ambil transkrip yang sudah ada (Cepat & Murah)
    // =================================================================
    console.log("Attempting Plan A: Fetching existing transcript...");
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const transcriptText = transcript.map((item) => item.text).join(" ");

    if (!transcriptText) {
      // Jika transkrip ada tapi kosong, lempar error untuk masuk ke Plan B
      throw new Error("Empty transcript found, attempting Plan B.");
    }

    console.log("Plan A successful. Summarizing text...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Model teks cukup
    const prompt = `Summarize the following YouTube video transcript into concise bullet points:\n\nTranscript: "${transcriptText}"\n\nSummary in bullet points:`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    return NextResponse.json({ summary, source: "transcript" });
  } catch (error) {
    console.warn("Plan A failed. Attempting Plan B: Audio processing.", error);

    // =================================================================
    // RENCANA B: Proses audio langsung (Lambat & Mahal)
    // =================================================================
    try {
      const info = await ytdl.getInfo(videoUrl);
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      if (audioFormats.length === 0) {
        return NextResponse.json(
          { error: "No audio found for this video." },
          { status: 404 }
        );
      }

      const stream = ytdl(videoUrl, {
        quality: "lowestaudio",
      });

      const audioPart = await streamToGenerativePart(stream);

      // Gunakan model yang lebih canggih yang bisa memproses audio
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
      });

      const prompt =
        "You are an expert video summarizer. Listen to the following audio from a YouTube video, transcribe it, and then provide a concise summary in bullet points. If there is no speech, state that. Summary:";

      const result = await model.generateContent([prompt, audioPart]);
      const summary = result.response.text();

      return NextResponse.json({ summary, source: "audio" });
    } catch (audioError) {
      console.error("Plan B also failed.", audioError);
      return NextResponse.json(
        {
          error:
            "Could not process the video. It might be private, age-restricted, or have processing issues.",
        },
        { status: 500 }
      );
    }
  }
}
