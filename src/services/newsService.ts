const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

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
  category: string = "general",
): Promise<NewsArticle[]> => {
  if (!API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_NEWS_API_KEY");
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    lang: "en",
    country: country,
    max: "10",
  });

  let endpoint = "top-headlines";
  const gnewsCategory = category || "general";
  params.set("category", gnewsCategory);

  try {
    const response = await fetch(
      `${BASE_URL}/${endpoint}?${params.toString()}`,
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key for GNews.io. Please check your configuration.",
        );
      }
      if (response.status === 403) {
        throw new Error(
          "Access forbidden. Your API key might not have permission for this request.",
        );
      }
      if (response.status === 429) {
        throw new Error("GNews limit reached. Please try again later.");
      }
      throw new Error(
        `GNews error (${response.status}). Please try again later.`,
      );
    }

    const data = await response.json();

    if (data.articles) {
      return data.articles.map((a: any) => ({
        title: a.title,
        description: a.description,
        urlToImage: a.image,
        source: {
          name: a.source.name,
        },
        publishedAt: a.publishedAt,
        url: a.url,
      }));
    } else {
      throw new Error(data.errors?.[0] || "Failed to fetch news from GNews.");
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
    console.error("Error fetching news from GNews:", error);
    throw error;
  }
};
