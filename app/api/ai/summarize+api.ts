const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
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
      const desc = (article.description || "").substring(0, 150);
      return `${index + 1}. TITLE: ${title}\n   INFO: ${desc}`;
    })
    .join("\n\n");

  const prompt = `You are a world-class news editor. Below are the top headlines and brief descriptions for today.
Create a high-quality, professional "Daily News Brief" that summarizes these events into exactly 5 distinct, informative bullet points. 

Articles context:
${articlesText}

Required Format:
Daily News Brief:
• [informative point about major event 1]
• [informative point about major event 2]
• [informative point about major event 3]
• [informative point about major event 4]
• [informative point about major event 5]

Make sure the summary is substantial and covers different topics from the articles provided.`;

  try {
    const geminiController = new AbortController();
    const geminiTimeout = setTimeout(() => geminiController.abort(), 55000);

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 768 },
      }),
      signal: geminiController.signal,
    });

    clearTimeout(geminiTimeout);

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
    if (err.name === "AbortError") {
      return Response.json(
        { error: "Gemini API took too long to respond. Please try again." },
        { status: 504 },
      );
    }
    return Response.json(
      { error: err.message || "Failed to contact Gemini API." },
      { status: 502 },
    );
  }
}
