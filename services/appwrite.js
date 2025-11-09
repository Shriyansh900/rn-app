import { Client, Databases, ID, Query } from "react-native-appwrite";

// --- Load env variables ---
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// --- Initialize Appwrite client ---
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject(PROJECT_ID);

const database = new Databases(client);

// --- Update search count ---
export const updateSearchCount = async (query, movie) => {
  if (!DATABASE_ID || !COLLECTION_ID) {
    console.error("Database or Collection ID not set!");
    return;
  }

  try {
    // Check if a document with this search term already exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: (existingMovie.count || 0) + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// --- Get top trending movies ---
export const getTrendingMovies = async () => {
  if (!DATABASE_ID || !COLLECTION_ID) return [];

  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    // Return the documents as JS objects
    return result.documents.map(doc => ({
      searchTerm: doc.searchTerm,
      movie_id: doc.movie_id,
      title: doc.title,
      count: doc.count,
      poster_url: doc.poster_url,
    }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
