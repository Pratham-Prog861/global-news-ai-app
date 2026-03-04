import * as SQLite from "expo-sqlite";

export interface SavedArticle {
  id?: number;
  title: string;
  description: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  url: string;
}

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("news.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_articles (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT NOT NULL,
        description TEXT,
        imageUrl    TEXT,
        source      TEXT NOT NULL,
        publishedAt TEXT NOT NULL,
        url         TEXT NOT NULL UNIQUE
      );
    `);
  }
  return db;
}

export async function saveArticle(article: SavedArticle): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR IGNORE INTO saved_articles
       (title, description, imageUrl, source, publishedAt, url)
     VALUES (?, ?, ?, ?, ?, ?);`,
    article.title,
    article.description,
    article.imageUrl ?? null,
    article.source,
    article.publishedAt,
    article.url,
  );
}

export async function getSavedArticles(): Promise<SavedArticle[]> {
  const database = await getDb();
  return database.getAllAsync<SavedArticle>(
    `SELECT * FROM saved_articles ORDER BY id DESC;`,
  );
}

export async function deleteArticle(url: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(`DELETE FROM saved_articles WHERE url = ?;`, url);
}
