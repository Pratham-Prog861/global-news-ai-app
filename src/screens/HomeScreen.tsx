import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { getTopHeadlines, NewsArticle } from '../services/newsService';
import NewsCard from '../components/NewsCard';

const HomeScreen = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const articles = await getTopHeadlines();
      setNews(articles);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching news.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <NewsCard
      title={item.title}
      description={item.description || 'No description available'}
      imageUrl={item.urlToImage}
      source={item.source.name}
      publishedAt={item.publishedAt}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching latest news...</Text>
      </View>
    );
  }

  if (error && news.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchNews()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Global News</Text>
        <Text style={styles.headerSubtitle}>Top Headlines</Text>
      </View>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.url || index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => fetchNews(true)} 
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No news articles found at the moment.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#5c6ac4',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomeScreen;
