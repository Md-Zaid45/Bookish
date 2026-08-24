import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({ ...params, availableCopies: params.totalCopies });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add book",
    };
  }
};

export default createBook