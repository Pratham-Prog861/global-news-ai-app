import Constants from "expo-constants";
import { Platform } from "react-native";
import { NewsArticle } from "./newsService";

function getApiBaseUrl(): string {
  if (Platform.OS === "web") {
    return "";
  }

  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    const isTunnel =
      hostUri.includes("exp.direct") || hostUri.includes("ngrok");
    const protocol = isTunnel ? "https" : "http";

    return `${protocol}://${hostUri.split("/")[0]}`;
  }

  return process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8081";
}

export const summarizeArticles = async (
  articles: NewsArticle[],
): Promise<string> => {
  const top10 = articles.slice(0, 10);

  if (top10.length === 0) {
    throw new Error("No articles available to summarize.");
  }

  const endpoint = `${getApiBaseUrl()}/api/ai/summarize`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles: top10 }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Server error: ${response.status}`);
    }

    if (!data.summary) {
      throw new Error("No summary returned from server.");
    }

    return data.summary as string;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Summary request timed out. Please try again.");
    }
    throw error;
  }
};
