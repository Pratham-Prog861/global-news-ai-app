import Constants from "expo-constants";
import { Platform } from "react-native";
import { NewsArticle } from "./newsService";

/**
 * Returns the base URL for internal API routes.
 * - Web: relative (empty string) — the browser resolves it automatically.
 * - Native dev: derived from the Expo dev-server host so the API routes on
 *   the same server are reachable from the device/simulator.
 * - Native prod: must be set via EXPO_PUBLIC_API_URL in your environment.
 */
function getApiBaseUrl(): string {
  if (Platform.OS === "web") {
    return "";
  }
  if (__DEV__) {
    const hostUri: string =
      (Constants.expoConfig?.hostUri as string | undefined) ?? "localhost:8081";
    const host = hostUri.split(":")[0];
    return `http://${host}:8081`;
  }
  return process.env.EXPO_PUBLIC_API_URL ?? "";
}

export const summarizeArticles = async (
  articles: NewsArticle[],
): Promise<string> => {
  const top10 = articles.slice(0, 10);

  if (top10.length === 0) {
    throw new Error("No articles available to summarize.");
  }

  const endpoint = `${getApiBaseUrl()}/api/ai/summarize`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articles: top10 }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Server error: ${response.status}`);
  }

  if (!data.summary) {
    throw new Error("No summary returned from server.");
  }

  return data.summary as string;
};
