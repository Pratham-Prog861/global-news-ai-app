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
  isSaved?: boolean;
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
  isSaved,
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
        isSaved: isSaved ? "true" : "false",
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        borderCurve: "continuous",
        marginBottom: 20,
        overflow: "hidden",
        boxShadow: pressed
          ? "0 4px 12px rgba(0,0,0,0.06)"
          : "0 8px 24px rgba(0,0,0,0.08)",
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 240 }}
          contentFit="cover"
          transition={500}
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

      <View style={{ padding: 18, gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: "#636366",
              textTransform: "uppercase",
              letterSpacing: 1.2,
            }}
          >
            {source}
          </Text>
          <Text style={{ fontSize: 11, color: "#C7C7CC" }}>•</Text>
          <Text style={{ fontSize: 12, color: "#8E8E93", fontWeight: "500" }}>
            {formattedDate}
          </Text>
        </View>

        <Text
          numberOfLines={3}
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: "#1C1C1E",
            lineHeight: 26,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Text>

        {!!description && description !== "null" && (
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              color: "#48484A",
              lineHeight: 22,
              fontWeight: "400",
            }}
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
                disabled={isSaved}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: isSaved
                    ? "#E8F5E9"
                    : pressed
                      ? "#E5E5EA"
                      : "#F2F2F7",
                  borderCurve: "continuous",
                })}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={isSaved ? "#2E7D32" : "#1C1C1E"}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: isSaved ? "#2E7D32" : "#1C1C1E",
                  }}
                >
                  {isSaved ? "Saved" : "Save"}
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
