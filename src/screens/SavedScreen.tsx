import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NewsCard from "../components/NewsCard";
import {
  deleteArticle,
  getSavedArticles,
  SavedArticle,
} from "../database/database";

const SavedScreen = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    setLoading(true);
    try {
      const saved = await getSavedArticles();
      setArticles(saved);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved]),
  );

  const handleDelete = async (url: string) => {
    await deleteArticle(url);
    setArticles((prev) => prev.filter((a) => a.url !== url));
  };

  const renderItem = ({ item }: { item: SavedArticle }) => (
    <NewsCard
      title={item.title}
      description={item.description || "No description available"}
      imageUrl={item.imageUrl}
      source={item.source}
      publishedAt={item.publishedAt}
      url={item.url}
      onDelete={() => handleDelete(item.url)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Saved Articles</Text>
          <Text style={styles.headerSubtitle}>{articles.length} saved</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No saved articles yet.</Text>
              <Text style={styles.emptySubText}>
                Tap &quot;Save&quot; on any article to bookmark it here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    gap: 8,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#555",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});

export default SavedScreen;
