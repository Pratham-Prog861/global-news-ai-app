import { saveArticle } from "@/src/database/database";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const ArticleScreen = () => {
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    imageUrl: string;
    source: string;
    publishedAt: string;
    url: string;
  }>();

  const navigation = useNavigation();
  const [saved, setSaved] = useState(false);

  const { title, description, imageUrl, source, publishedAt, url } = params;
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleSave = useCallback(async () => {
    try {
      await saveArticle({
        title: title ?? "",
        description: description ?? "",
        imageUrl: imageUrl ?? null,
        source: source ?? "",
        publishedAt: publishedAt ?? "",
        url: url ?? "",
      });
      setSaved(true);
    } catch (err) {
      console.warn("Failed to save article", err);
    }
  }, [title, description, imageUrl, source, publishedAt, url]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleSave}
          hitSlop={12}
          style={{ paddingHorizontal: 4 }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={saved ? "#007AFF" : "#007AFF"}
          />
        </Pressable>
      ),
    });
  }, [navigation, handleSave, saved]);

  const handleOpenBrowser = useCallback(async () => {
    if (url) {
      await WebBrowser.openBrowserAsync(url);
    }
  }, [url]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#F2F2F7" }}
    >
      {/* Hero image */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 260 }}
          contentFit="cover"
          transition={400}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 180,
            backgroundColor: "#E5E5EA",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="image-outline" size={48} color="#C7C7CC" />
        </View>
      )}

      <View style={{ padding: 20, gap: 16 }}>
        {/* Source badge + date */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              backgroundColor: "#007AFF",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {source}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: "#8E8E93" }}>
            {formattedDate}
          </Text>
        </View>

        {/* Title */}
        <Text
          selectable
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#1C1C1E",
            lineHeight: 32,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Text>

        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: "#E5E5EA", borderRadius: 1 }}
        />

        {/* Description / body */}
        {description && description !== "null" ? (
          <Text
            selectable
            style={{
              fontSize: 17,
              color: "#3A3A3C",
              lineHeight: 26,
            }}
          >
            {description}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 16,
              color: "#8E8E93",
              fontStyle: "italic",
              lineHeight: 24,
            }}
          >
            No preview available. Read the full article for details.
          </Text>
        )}

        {/* Read full article button */}
        <Pressable
          onPress={handleOpenBrowser}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#0062CC" : "#007AFF",
            borderRadius: 14,
            borderCurve: "continuous",
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
            boxShadow: "0 4px 16px rgba(0, 122, 255, 0.3)",
          })}
        >
          <Ionicons name="open-outline" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            Read Full Article
          </Text>
        </Pressable>

        <View style={{ height: 16 }} />
      </View>
    </ScrollView>
  );
};

export default ArticleScreen;
