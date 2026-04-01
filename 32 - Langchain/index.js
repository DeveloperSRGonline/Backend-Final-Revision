import { config } from "dotenv";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";

config();

// model creation
const model = new ChatGoogle({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});

const PromptTemplateInstance = PromptTemplate.fromTemplate(`
    explain {topic} in simple way like eli5 ,
    make sure to include the core concepts and avoid unnecessary jargons,
    make the answer as consise as possible
    `);

PromptTemplateInstance.pipe(model).invoke({ topic: "Quantum Computing" }).then(response => {
    console.log(response.content);
});