import dotenv from "dotenv";
dotenv.config();
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { GoogleGenAI,Type } from "@google/genai"
import { required } from "zod/mini";


const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
})

const tools = [];

const transport = new StdioClientTransport({
    command:"node",
    args:["d:\\Backend-Final-Revision\\34 - MCP server - 02\\mcp.server.js"]

});

const client = new Client({
    name:"example-client",
    version:"1.0.0"
});

await client.connect(transport);

client.listTools().then(async (result) => {
    result.tools.forEach((tool) => {
        tools.push({
            name:tool.name,
            description:tool.description,
            parameters:{
                type:Type.OBJECT,
                properties:{
                    a:{type:Type.NUMBER, description:"First number"},
                    b:{type:Type.NUMBER, description:"Second number"}
                },
                required:["a", "b"]
            }
        })
    })

    const aiResponse = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:"Use the addTwoNumbers tool to add 2 and 3. Please call the function with the required parameters.",
        config:{
            tools:[{
                functionDeclarations:tools
            }]
        }
    })

    console.log("Tool called : ",aiResponse.functionCalls);


    for (const call of aiResponse.functionCalls) {
        const toolResponse = await client.callTool({
            name:call.name,
            arguments:call.args
        })
        console.log("ToolResponse : ",toolResponse);
    }
});
