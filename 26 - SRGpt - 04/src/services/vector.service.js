const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const cohortSRGptIndex = pc.index({
  name: "srgpt-ai",
  host: process.env.PINECONE_INDEX_HOST,
});

async function createMemory({ vectors, metadata, messageId }) {
  await cohortSRGptIndex.upsert({
    records: [
      {
        id: messageId,
        values: vectors,
        metadata,
      },
    ],
  });
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const filter =
    metadata && Object.keys(metadata).length > 0 ? metadata : undefined;

  const data = await cohortSRGptIndex.query({
    vector: queryVector,
    topK: limit,
    filter,
    includeMetadata: true,
  });

  return data.matches;
}

module.exports = { createMemory, queryMemory };
