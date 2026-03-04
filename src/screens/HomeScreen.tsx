import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import NewsCard from "@/src/components/NewsCard";
import { saveArticle } from "@/src/database/database";
import { getTopHeadlines, NewsArticle } from "@/src/services/newsService";

const COUNTRIES = [
  { code: "us", label: "US", flag: "🇺🇸" },
  { code: "in", label: "IN", flag: "🇮🇳" },
  { code: "gb", label: "GB", flag: "🇬🇧" },
  { code: "au", label: "AU", flag: "🇦🇺" },
  { code: "ca", label: "CA", flag: "🇨🇦" },
  { code: "de", label: "DE", flag: "🇩🇪" },
];

const CATEGORIES = [
  { key: "business", label: "Business", icon: "briefcase-outline" as const },
  { key: "technology", label: "Tech", icon: "laptop-outline" as const },
  { key: "sports", label: "Sports", icon: "football-outline" as const },
  { key: "health", label: "Health", icon: "heart-outline" as const },
  { key: "science", label: "Science", icon: "flask-outline" as const },
  { key: "entertainment", label: "Entertainment", icon: "film-outline" as const },
];

const HomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const requestIdRef = useRef(0);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchNews = useCallback(
    async (country: string, category: string, isRefreshing = false) => {
      const requestId = ++requestIdRef.current;
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const articles = await getTopHeadlines(country, category);
        if (requestId !== requestIdRef.current) return;
        setNews(articles);
        setError(null);
      } catch (err: any) {
        if (requestId !== requestIdRef.current) return;
        setError(err.message || "Something went wrong while fetching news.");
      } finally {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchNews(selectedCountry, selectedCategory);
  }, [selectedCountry, selectedCategory, fetchNews]);

  const handleNavigateToSummary = useCallback(() => {
    router.push({
      pathname: "/summary" as any,
      params: { articles: JSON.stringify(news.slice(0, 10)) },
    });
  }, [news, router]);

  // Set header right (AI Summary button)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleNavigateToSummary}
          disabled={news.length === 0}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 20,
            backgroundColor: pressed ? "#0062CC" : "#007AFF",
            opacity: news.length === 0 ? 0.4 : 1,
          })}
        >
          <Ionicons name="sparkles" size={13} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
            AI Summary
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, handleNavigateToSummary, news.length]);

  const handleSave = useCallback(async (item: NewsArticle) => {
    try {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await saveArticle({
        title: item.title,
        description: item.description || "",
        imageUrl: item.urlToImage,
        source: item.source.name,
        publishedAt: item.publishedAt,
        url: item.url,
      });
    } catch (err) {
      console.warn("Failed to save article", err);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchNews(selectedCountry, selectedCategory, true);
  }, [fetchNews, selectedCountry, selectedCategory]);

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => (
      <NewsCard
        title={item.title}
        description={item.description || "No description available"}
        imageUrl={item.urlToImage}
        source={item.source.name}
        publishedAt={item.publishedAt}
        url={item.url}
        onSave={() => handleSave(item)}
      />
    ),
    [handleSave],
  );

  const ListHeader = (
    <View style={{ gap: 0 }}>
      {/* Country pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
      >
        {COUNTRIES.map((c) => {
          const active = selectedCountry === c.code;
          return (
            <Pressable
              key={c.code}
              onPress={() => setSelectedCountry(c.code)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: active
                  ? "#007AFF"
                  : pressed
                  ? "#E5E5EA"
                  : "#F2F2F7",
                borderWidth: active ? 0 : 1,
                borderColor: "#E5E5EA",
              })}
            >
              <Text style={{ fontSize: 14 }}>{c.flag}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: active ? "#fff" : "#3A3A3C",
                }}
              >
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 14, gap: 8 }}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <Pressable
              key={cat.key}
              onPress={() =>
                setSelectedCategory((prev) =>
                  prev === cat.key ? "" : cat.key,
                )
              }
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 13,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: active
                  ? "#34C759"
                  : pressed
                  ? "#E5E5EA"
                  : "#F2F2F7",
                borderWidth: active ? 0 : 1,
                borderColor: "#E5E5EA",
              })}
            >
              <Ionicons
                name={cat.icon}
                size={13}
                color={active ? "#fff" : "#636366"}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: active ? "#fff" : "#3A3A3C",
                }}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Loading/error inline indicator */}
      {loading && (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 12, fontSize: 15, color: "#8E8E93" }}>
            Fetching latest news…
          </Text>
        </View>
      )}

      {error && news.length === 0 && !loading && (
        <View
          style={{
            margin: 16,
            padding: 20,
            borderRadius: 18,
            borderCurve: "continuous",
            backgroundColor: "#FFF0F0",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Ionicons name="warning-outline" size={32} color="#FF3B30" />
          <Text
            style={{ fontSize: 16, fontWeight: "700", color: "#1C1C1E", textAlign: "center" }}
          >
            Could not load news
          </Text>
          <Text
            style={{ fontSize: 14, color: "#636366", textAlign: "center" }}
          >
            {error}
          </Text>
          <Pressable
            onPress={() => fetchNews(selectedCountry, selectedCategory)}
            style={{ marginTop: 4, backgroundColor: "#FF3B30", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
              Try Again
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={loading ? [] : news}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.url || index.toString()}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 0 }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
      ListHeaderComponent={ListHeader}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#007AFF"
          colors={["#007AFF"]}
        />
      }
      ListEmptyComponent={
        !loading ? (
          <View
            style={{
              paddingVertical: 60,
              alignItems: "center",
              gap: 10,
            }}
          >
            <Ionicons name="newspaper-outline" size={48} color="#C7C7CC" />
            <Text style={{ fontSize: 16, color: "#8E8E93", textAlign: "center" }}>
              No articles found.{"\n"}Try a different country or category.
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default HomeScreen;
