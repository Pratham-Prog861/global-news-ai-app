import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NewsCard from "../components/NewsCard";
import { getTopHeadlines, NewsArticle } from "../services/newsService";

const COUNTRIES = [
  { code: "us", label: "US", flag: "🇺🇸" },
  { code: "in", label: "IN", flag: "🇮🇳" },
  { code: "gb", label: "GB", flag: "🇬🇧" },
  { code: "au", label: "AU", flag: "🇦🇺" },
];

type CategoryIcon = React.ComponentProps<typeof Ionicons>["name"];

const CATEGORIES: { key: string; label: string; icon: CategoryIcon }[] = [
  { key: "business", label: "Business", icon: "briefcase-outline" },
  { key: "technology", label: "Technology", icon: "laptop-outline" },
  { key: "sports", label: "Sports", icon: "football-outline" },
  { key: "health", label: "Health", icon: "heart-outline" },
  { key: "science", label: "Science", icon: "flask-outline" },
];

const HomeScreen = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchNews = useCallback(
    async (country: string, category: string, isRefreshing = false) => {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const articles = await getTopHeadlines(country, category);
        setNews(articles);
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching news.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchNews(selectedCountry, selectedCategory);
  }, [selectedCountry, selectedCategory, fetchNews]);

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <NewsCard
      title={item.title}
      description={item.description || "No description available"}
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
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchNews(selectedCountry, selectedCategory)}
        >
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

      {/* Country Filter */}
      <View style={styles.countryRow}>
        {COUNTRIES.map((c) => {
          const active = selectedCountry === c.code;
          return (
            <TouchableOpacity
              key={c.code}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedCountry(c.code)}
            >
              <Text style={styles.flagText}>{c.flag}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() =>
                setSelectedCategory((prev) => (prev === cat.key ? "" : cat.key))
              }
            >
              <Ionicons
                name={cat.icon}
                size={14}
                color={active ? "#ffffff" : "#555"}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.url || index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNews(selectedCountry, selectedCategory, true)}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No news articles found at the moment.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f7fa",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#5c6ac4",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  countryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: "#ffffff",
    gap: 8,
  },
  categoryScroll: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#d0d7de",
    backgroundColor: "#f5f7fa",
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  flagText: {
    fontSize: 14,
    marginRight: 5,
  },
  categoryIcon: {
    marginRight: 5,
  },
});

export default HomeScreen;
