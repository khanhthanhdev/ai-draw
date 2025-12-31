# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build`
- **Development Server**: `npm run dev` (Runs on port 6002 by default)
- **Lint**: `npm run lint` (Uses Biome)
- **Format**: `npm run format` (Uses Biome)
- **Check (CI)**: `npm run check` (Biome CI)

## High-Level Architecture

### Overview
StemFun is a Next.js application that integrates AI capabilities with the Draw.io diagramming tool. It allows users to create and edit diagrams through a natural language chat interface.

### Key Components
- **Draw.io Integration**: Uses `react-drawio` to embed the Draw.io editor. The editor state is managed via `useDiagram` hook and `DiagramProvider` context.
- **Chat Interface**: Located in `components/chat-panel.tsx`. Handles user input, file uploads (PDFs, images), and displays AI responses.
- **AI Backend**: The main chat endpoint is `app/api/chat/route.ts`. It uses the Vercel AI SDK (`ai`) to orchestrate multi-provider LLM calls.
- **Diagram Tools**: The AI interacts with the diagram via structured tool calls:
  - `display_diagram`: Renders a full diagram XML.
  - `edit_diagram`: Performs incremental updates (add/update/delete) on mxCell elements.
  - `append_diagram`: Handles truncated XML responses.

### State & Data
- **Global Context**: `contexts/diagram-context.tsx` manages the Draw.io reference, XML state, and interaction methods.
- **Database/Auth**: Uses Convex (`convex/`) for backend operations and Better Auth (`lib/auth-client.ts`) for authentication.
- **Providers**: AI provider configurations are centralized in `lib/ai-providers.ts`.

### Project Structure
- `app/`: Next.js App Router (pages and API routes).
- `components/`: React components, including UI primitives in `components/ui/`.
- `lib/`: Utility functions, AI provider logic, and authentication helpers.
- `convex/`: Backend schema and functions.
- `packages/mcp-server/`: Model Context Protocol server implementation.

## Code Guidelines
- **Tooling**: Uses Biome for linting and formatting. Indentation is 4 spaces.
- **Styles**: Tailwind CSS with Radix UI components.
- **API**: Streaming responses via Vercel AI SDK.
- **XML**: Draw.io diagrams are represented as mxGraph XML. AI tools specifically target `mxCell` elements.
