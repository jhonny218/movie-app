import { Client, TablesDB, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tablesDB = new TablesDB(client);

// Test connection to Appwrite
export const testAppwriteConnection = async () => {
  try {
    console.log("🔍 Testing Appwrite connection...");
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5)],
    });
    console.log("✅ Appwrite connected successfully!");
    console.log(`📊 Found ${result.total} total rows in table`);
    if (result.rows.length > 0) {
      console.log("📝 Recent searches:", result.rows.map((r: any) => `${r.searchTerm} (${r.count})`));
    }
    return true;
  } catch (error) {
    console.error("❌ Appwrite connection failed:", error);
    return false;
  }
};

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    console.log(result);

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];
      await tablesDB.incrementRowColumn({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: existingMovie.$id,
        column: "count",
        value: 1,
      });
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id.toString(),
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
