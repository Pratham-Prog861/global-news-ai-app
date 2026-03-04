const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export interface NewsArticle {
  title: string;
  description: string | null;
  urlToImage: string | null;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
}

export const getTopHeadlines = async (
  country: string = "us",
  category: string = "",
): Promise<NewsArticle[]> => {
  if (!API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_NEWS_API_KEY");
  }

  // Include apiKey as query param for compatibility (some networks may strip headers)
  const params = new URLSearchParams({
    country,
    apiKey: API_KEY,
    pageSize: "20",
  });
  if (category) params.set("category", category);

  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?${params.toString()}`,
      {
        headers: {
          "X-Api-Key": API_KEY,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your configuration.");
      }
      if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again.",
        );
      }
      throw new Error(
        `Server error (${response.status}). Please try again later.`,
      );
    }

    const data = await response.json();

    if (data.status === "ok") {
      // Filter out articles with [Removed] content (NewsAPI free-tier artifact)
      const articles: NewsArticle[] = (data.articles ?? []).filter(
        (a: NewsArticle) =>
          a.title &&
          a.title !== "[Removed]" &&
          a.url &&
          a.url !== "https://removed.com",
      );
      return articles;
    } else {
      throw new Error(data.message || "Failed to fetch news.");
    }
  } catch (error: any) {
    if (
      error.name === "TypeError" &&
      error.message === "Network request failed"
    ) {
      throw new Error(
        "No internet connection. Please check your network and try again.",
      );
    }
    console.error("Error fetching news:", error);
    throw error;
  }
};
