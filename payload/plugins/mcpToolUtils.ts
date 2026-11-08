import type { MCPPluginConfig } from '@payloadcms/plugin-mcp';

/** One custom tool as accepted by `mcpPlugin({ mcp: { tools } })`. */
export type MCPTool = NonNullable<NonNullable<MCPPluginConfig['mcp']>['tools']>[number];

export type ToolResult = { content: Array<{ type: 'text'; text: string }> };

/** Wrap a message as an MCP text result. Errors are returned this way too, never thrown. */
export const text = (message: string): ToolResult => ({
  content: [{ type: 'text', text: message }],
});
