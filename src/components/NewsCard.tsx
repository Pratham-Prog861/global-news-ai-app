import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  onSave,
  onDelete,
}) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image Available</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.metaInfo}>
          <Text style={styles.sourceText}>{source}</Text>
          <Text style={styles.dotSeparator}>{" • "}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        {!!description && (
          <Text style={styles.descriptionText} numberOfLines={3}>
            {description}
          </Text>
        )}
        {(onSave || onDelete) && (
          <View style={styles.actionRow}>
            {onSave && (
              <TouchableOpacity style={styles.actionButton} onPress={onSave}>
                <Ionicons name="bookmark-outline" size={16} color="#007AFF" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={onDelete}
              >
                <Ionicons name="trash-outline" size={16} color="#ff3b30" />
                <Text style={[styles.actionText, styles.deleteText]}>
                  Remove
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: 200,
  },
  placeholderImage: {
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    textTransform: "uppercase",
  },
  dotSeparator: {
    fontSize: 12,
    color: "#999",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: "#4a4a4a",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#007AFF",
    backgroundColor: "#f0f7ff",
  },
  deleteButton: {
    borderColor: "#ff3b30",
    backgroundColor: "#fff5f5",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
  },
  deleteText: {
    color: "#ff3b30",
  },
});

export default NewsCard;
