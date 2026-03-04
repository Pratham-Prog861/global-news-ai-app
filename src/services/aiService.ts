import { NewsArticle } from "./newsService";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3-flash-preview";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export const summarizeArticles = async (
  articles: NewsArticle[],
): Promise<string> => {
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
Daily News Brief:
• [summary point 1]
• [summary point 2]
• [summary point 3]
• [summary point 4]
• [summary point 5]

Today's articles:
${articlesText}

Summarize the key stories into exactly 5 bullet points. Each bullet point should be a clear, informative sentence.`;

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Gemini API error: ${response.status}`,
    );
  }

  const data = await response.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No summary returned from AI.");
  }

  return text.trim();
};
