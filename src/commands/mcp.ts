/**
 * MCP command - starts the MCP server
 */

export async function mcpCommand() {
  // Import and run the MCP server
  // The index.ts file will automatically start the server when imported
  await import("../index.js");
}
