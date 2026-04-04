import { McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create MCP server
const server = new McpServer(
  {
    name: "example-server",
    version: "1.0.0",
  }
);

// add tool to server (just a simple tool for ai to use to add two numbers)
server.registerTool("addTwoNumbers",
    {
        title:"Addition Tool",
        description:"Add two numbers",
        inputSchema:{
            a:z.number().describe("First number"), 
            b:z.number().describe("Second number")
        }
    },
    async ({a,b}) => {
        return {
            content:[{type:"text",text:String(a + b)}]
        }
    }
)

const transport = new StdioServerTransport();
await server.connect(transport)