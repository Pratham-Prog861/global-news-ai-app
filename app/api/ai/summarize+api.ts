const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.0-flash-preview";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: Request): Promise<Response> {
  if (!GEMINI_API_KEY) {
    return Response.json(
      { error: "Server is missing GEMINI_API_KEY configuration." },
      { status: 500 },
    );
  }

  let articles: { title?: string; description?: string | null }[];
  try {
    const body = await request.json();
    articles = body.articles;
    if (!Array.isArray(articles)) throw new Error("Invalid articles payload");
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const top10 = articles.slice(0, 10);
  const articlesText = top10
    .map((article, index) => {
      const title = article.title || "No title";
      const description = article.description || "No description";
      return `${index + 1}. Title: ${title}\n   Description: ${description}`;
    })
    .join("\n\n");

  const prompt = `You are a professional news summarizer. Based on the following news articles from today, provide a concise news brief.

Format your response EXACTLY as:
Daily News Brief:• [summary point 1]
• [summary point 2]
• [summary point 3]
• [summary point 4]
• [summary point 5]

Today's articles:
${articlesText}

Summarize the key stories into exactly 5 bullet points. Each bullet point should be a clear, informative sentence.`;

  try {
    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      const message =
        errorData?.error?.message ||
        `Gemini API error: ${geminiResponse.status}`;
      return Response.json({ error: message }, { status: 502 });
    }

    const data = await geminiResponse.json();
    const summary: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      return Response.json(
        { error: "No summary returned from AI." },
        { status: 502 },
      );
    }

    return Response.json({ summary: summary.trim() });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Failed to contact Gemini API." },
      { status: 502 },
    );
  }
}
