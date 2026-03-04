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

export const getTopHeadlines = async (): Promise<NewsArticle[]> => {
  if (!API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_NEWS_API_KEY");
  }

  try {
    const response = await fetch(`${BASE_URL}/top-headlines?country=us`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    const data = await response.json();

    if (data.status === "ok") {
      return data.articles;
    } else {
      throw new Error(data.message || "Failed to fetch news");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
