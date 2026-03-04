const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  title: string;
  description: string;
  urlToImage: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
}

export const getTopHeadlines = async (): Promise<NewsArticle[]> => {
  if (!API_KEY) {
    console.warn('News API key is not defined in environment variables.');
  }

  try {
    // Note: NewsAPI requires country, category, or sources for top-headlines.
    // Using 'us' as a default for "global" context if no other filter is specified.
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'ok') {
      return data.articles;
    } else {
      throw new Error(data.message || 'Failed to fetch news');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
