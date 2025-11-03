# Contributing to Universal Skills MCP Server

Thank you for your interest in contributing! This guide covers development setup and architecture.

## Development

### Development Mode (with auto-reload)

```bash
npm run dev
```

This watches for file changes and automatically recompiles.

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Clean Build Artifacts

```bash
npm run clean
```

Removes the `dist/` directory.

### Lint

```bash
npm run lint
```

Runs ESLint on the source code.

### Project Structure

```
src/
├── index.ts          # MCP server entry point
├── types.ts          # TypeScript interfaces and types
├── constants.ts      # Shared constants
├── schemas.ts        # Zod validation schemas
├── skill-scanner.ts  # Skill discovery and caching
├── skill-loader.ts   # Skill file loading and parsing
└── utils.ts          # Utility functions
```

### Architecture

- **MCP Protocol**: Uses `@modelcontextprotocol/sdk` for stdio communication
- **Validation**: Zod schemas for runtime type checking
- **Parsing**: gray-matter for YAML frontmatter extraction
- **Caching**: In-memory Map with 30-second refresh
- **Error Handling**: Graceful degradation with detailed logging
