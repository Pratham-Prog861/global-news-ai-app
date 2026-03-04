import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  url?: string;
  onSave?: () => void;
  onDelete?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  source,
  publishedAt,
  url,
  onSave,
  onDelete,
}) => {
  const router = useRouter();
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handlePress = () => {
    router.push({
      pathname: "/news/[id]" as any,
      params: {
        id: encodeURIComponent(url ?? title),
        title,
        description,
        imageUrl: imageUrl ?? "",
        source,
        publishedAt,
        url: url ?? "",
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderCurve: "continuous",
        marginBottom: 16,
        overflow: "hidden",
        boxShadow: pressed
          ? "0 1px 4px rgba(0,0,0,0.08)"
          : "0 2px 12px rgba(0,0,0,0.10)",
        opacity: pressed ? 0.97 : 1,
      })}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 200 }}
          contentFit="cover"
          transition={400}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 120,
            backgroundColor: "#F2F2F7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="image-outline" size={36} color="#C7C7CC" />
        </View>
      )}

      <View style={{ padding: 14, gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#007AFF",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {source}
          </Text>
          <Text style={{ fontSize: 11, color: "#C7C7CC" }}>•</Text>
          <Text style={{ fontSize: 11, color: "#8E8E93" }}>{formattedDate}</Text>
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: "#1C1C1E",
            lineHeight: 22,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </Text>

        {!!description && description !== "null" && (
          <Text
            numberOfLines={2}
            style={{ fontSize: 14, color: "#636366", lineHeight: 20 }}
          >
            {description}
          </Text>
        )}

        {(onSave || onDelete) && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 4,
              gap: 8,
              borderTopWidth: 1,
              borderTopColor: "#F2F2F7",
              paddingTop: 10,
            }}
          >
            {onSave && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onSave();
                }}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: pressed ? "#E5F0FF" : "#F0F7FF",
                  borderWidth: 1.5,
                  borderColor: "#D0E8FF",
                })}
              >
                <Ionicons name="bookmark-outline" size={15} color="#007AFF" />
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#007AFF" }}
                >
                  Save
                </Text>
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onDelete();
                }}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: pressed ? "#FFE5E5" : "#FFF0F0",
                  borderWidth: 1.5,
                  borderColor: "#FFD0D0",
                })}
              >
                <Ionicons name="trash-outline" size={15} color="#FF3B30" />
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#FF3B30" }}
                >
                  Remove
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default NewsCard;
