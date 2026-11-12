import config from "./config";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001";

export const EMBEDDING_DIMENSIONS = 768;
const EMBEDDING_MODEL = "gemini-embedding-001";

type TaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY";

interface EmbedContentRequest {
  model: string;
  content: { parts: { text: string }[] };
  taskType: TaskType;
  outputDimensionality: number;
  embedContentConfig: {
    taskType: TaskType;
    outputDimensionality: number;
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const geminiFetch = async (path: string, body: unknown) => {
  const apiKey = process.env.GEMINI_API_KEY ?? config.env.gemini.apiKey;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env.local");
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${GEMINI_ENDPOINT}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      const backoff = 1000 * 2 ** attempt;
      console.warn(`Rate limited (429), retrying in ${backoff}ms...`);
      await sleep(backoff);
      continue;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${text}`);
    }

    return res.json();
  }

  throw new Error("Gemini API: rate limit retries exhausted");
};

const buildRequest = (text: string, taskType: TaskType): EmbedContentRequest => ({
  model: `models/${EMBEDDING_MODEL}`,
  content: { parts: [{ text }] },
  taskType,
  outputDimensionality: EMBEDDING_DIMENSIONS,
  embedContentConfig: {
    taskType,
    outputDimensionality: EMBEDDING_DIMENSIONS,
  },
});

// Gemini may return the full 3072-dim vector if outputDimensionality is
// ignored; truncate so pgvector vector(768) accepts it (cosine ops renormalize).
const fitToDimensions = (values: number[]): number[] => {
  if (values.length === EMBEDDING_DIMENSIONS) return values;
  console.warn(
    `Gemini returned ${values.length} dims, truncating to ${EMBEDDING_DIMENSIONS}`
  );
  return values.slice(0, EMBEDDING_DIMENSIONS);
};

export const embedText = async (
  text: string,
  taskType: TaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[]> => {
  const data = await geminiFetch(":embedContent", buildRequest(text, taskType));
  return fitToDimensions(data.embedding.values as number[]);
};

export const embedBatch = async (
  texts: string[],
  taskType: TaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[][]> => {
  const data = await geminiFetch(":batchEmbedContents", {
    requests: texts.map((text) => buildRequest(text, taskType)),
  });
  return (data.embeddings as Array<{ values: number[] }>).map((e) =>
    fitToDimensions(e.values)
  );
};

export const bookEmbeddingText = (book: {
  title: string;
  author: string;
  genre: string;
  summary: string;
  description: string;
}) => `${book.title}. By ${book.author}. Genre: ${book.genre}. ${book.summary}. ${book.description}`;
