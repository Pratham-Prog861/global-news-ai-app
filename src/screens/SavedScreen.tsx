import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";
import NewsCard from "@/src/components/NewsCard";
import {
  deleteArticle,
  getSavedArticles,
  SavedArticle,
} from "@/src/database/database";

const SavedScreen = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    setLoading(true);
    try {
      const saved = await getSavedArticles();
      setArticles(saved);
    } catch (err) {
      console.warn("Failed to load saved articles", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved]),
  );

  // Update subtitle count in header
  useEffect(() => {
    navigation.setOptions({
      headerSubtitle: `${articles.length} article${articles.length !== 1 ? "s" : ""}`,
    });
  }, [navigation, articles.length]);

  const handleDelete = useCallback(async (url: string) => {
    try {
      await deleteArticle(url);
      setArticles((prev) => prev.filter((a) => a.url !== url));
    } catch (err) {
      console.warn("Failed to delete saved article", err);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: SavedArticle }) => (
      <NewsCard
        title={item.title}
        description={item.description || "No description available"}
        imageUrl={item.imageUrl}
        source={item.source}
        publishedAt={item.publishedAt}
        url={item.url}
        onDelete={() => handleDelete(item.url)}
      />
    ),
    [handleDelete],
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.url}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 80,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#F2F2F7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="bookmark-outline" size={36} color="#C7C7CC" />
          </View>
          <Text
            style={{ fontSize: 18, fontWeight: "700", color: "#1C1C1E" }}
          >
            No Saved Articles
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#8E8E93",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Articles you save will appear here.{"\n"}Tap Save on any story to bookmark it.
          </Text>
        </View>
      }
    />
  );
};

export default SavedScreen;
