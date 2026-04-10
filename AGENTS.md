# Project Context - `jawuan-gpt-client`

React frontend for Jawuan GPT, a personal AI-powered chatbot. Communicates with [jawuan-gpt-api](https://github.com/jawuanlewis/jawuan-gpt-api) to manage chat sessions and stream AI responses.

## Stack

- **Language:** TypeScript
- **Framework:** React 19
- **Build tool:** Vite (SWC)
- **Styling:** Plain CSS with CSS variables (no framework)
- **HTTP client:** Axios
- **Deployment:** Vercel (with `@vercel/analytics`)
- **ID generation:** UUID
- **Linting:** ESLint + TypeScript ESLint
- **Formatting:** Prettier
- **Package manager:** pnpm
- **Testing:** None configured

## Architecture

```text
main.tsx → App.tsx (state) → SideBar.tsx
                           → ChatArea.tsx → Conversation.tsx
                                          → ChatItem.tsx
```

- `src/main.tsx` — React DOM entry point
- `src/App.tsx` — root component; owns all global state and data fetching
- `src/components/` — UI components
- `src/services/` — API communication layer
- `src/styles/` — per-component CSS files
- `src/types/chat.ts` — shared TypeScript interfaces
- `src/utils/client-id.ts` — session ID generation and storage

## Key Files

| File                              | Purpose                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/App.tsx`                     | Holds `chats`, `activeChat`, `isMobile`, `isSidebarOpen` state; fetches chat history on mount |
| `src/components/ChatArea.tsx`     | Prompt input, loading state, message sending; shows time-of-day greeting                      |
| `src/components/SideBar.tsx`      | Chat list, new chat button, sidebar visibility                                                |
| `src/components/Conversation.tsx` | Message display with auto-scroll                                                              |
| `src/components/ChatItem.tsx`     | Individual chat entry with inline title editing                                               |
| `src/services/api-client.ts`      | Axios instance; injects `X-Client-ID` header via request interceptor                          |
| `src/services/chat-service.ts`    | API facade — `getChatHistory()`, `handlePrompt()`, `updateChatTitle()`                        |
| `src/utils/client-id.ts`          | Generates a random 30-char session ID stored in `sessionStorage`                              |

## API Communication

All requests go to `VITE_API_URL` (via Axios). The `X-Client-ID` header is injected automatically by `api-client.ts` on every request.

| Method | Endpoint            | Description                                        |
| ------ | ------------------- | -------------------------------------------------- |
| GET    | `/api/chat/history` | Fetch all chats for the session                    |
| POST   | `/api/chat/prompt`  | Send prompt; pass `null` chat for new conversation |
| PATCH  | `/api/chat/title`   | Update chat title                                  |

## State Management

No external state library — React hooks only.

- `App.tsx` owns all shared state and passes it down via props (no Context API)
- `sessionStorage` persists the active chat across page reloads (`ACTIVE_CHAT` key)
- Chat list (`chats`) is not persisted — fetched fresh from the API on every mount

## Routing

No routing library. Single-page app — navigation is entirely state-based (setting `activeChat`). No URL changes occur.

## Conventions

- **Components:** PascalCase files and exports (`ChatArea.tsx`, `SideBar.tsx`)
- **Services/utils/types:** kebab-case files (`api-client.ts`, `chat-service.ts`, `client-id.ts`, `chat.ts`)
- **CSS:** kebab-case, one file per component (`chat-area.css`, `sidebar.css`)
- **Interfaces:** PascalCase (`Message`, `Chat`, `CurrChat`)
- **Path alias:** `@src/*` resolves to `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`)

## Dev Commands

```bash
pnpm dev      # Vite dev server at http://localhost:5173
pnpm build    # tsc type check + Vite production build → dist/
pnpm preview  # Preview production build locally
pnpm lint     # ESLint --fix
pnpm format   # Prettier format
```

## Environment Variables

| Variable       | Required | Description                                         |
| -------------- | -------- | --------------------------------------------------- |
| `VITE_API_URL` | Yes      | Backend API base URL (e.g. `http://localhost:3000`) |

The Vite dev server proxies `/api/*` requests to `VITE_API_URL`, so direct API calls work in development without CORS issues.

## Gotchas

- **State drilling** — all state lives in `App.tsx` and flows down via props; there is no Context API. Keep this pattern rather than introducing a state library unless the component tree grows significantly
- **Loading message placeholder** — while awaiting an AI response, a fake message with `id="loading"` and `content="..."` is inserted into the conversation. It's replaced on success but remains if the API call fails; handle this edge case if modifying the prompt flow
- **Session ID is not auth** — `clientId` is a random string in `sessionStorage`, not a signed token. It resets on session end (new tab/window). Do not treat it as a persistent user identity
- **No dark mode toggle** — the app is always dark-themed via CSS variables; there is no light/dark switch
- **Mobile sidebar** — at <768px the sidebar is `position: fixed` with `z-index: 100` and overlays the chat area; it does not use a drawer/slide animation
- **`noUnusedLocals` / `noUnusedParameters`** are enabled in `tsconfig.app.json` — unused variables cause the build to fail, not just warn
- **Vercel Analytics** — `<Analytics />` is rendered in the app; it's a no-op outside Vercel deployments so it can be left in place locally
