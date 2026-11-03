# Architecture Note

## Technology stack

- **Laravel and Inertia.js with React:** Laravel handles routing, validation, persistence, authentication, and policies. Inertia connects those server-side routes to React pages without a separate API layer.
- **Tailwind CSS:** Supports fast, responsive styling for the workspace, document editor, and authentication screens.
- **MySQL:** Stores document ownership and collaboration relationships with relational constraints.

The assessment brief targets Laravel 11. This repository currently installs Laravel 13.40, Inertia Laravel 2.0, React 18, and Tailwind CSS 3, and is implemented against those installed versions.

## Database schema

### `documents`

| Column | Purpose |
| --- | --- |
| `id` | Document identifier |
| `user_id` | Owner; references `users.id` |
| `title` | Document title |
| `content` | Rich-text HTML content |
| `created_at`, `updated_at` | Timestamps |

### `document_user`

| Column | Purpose |
| --- | --- |
| `id` | Sharing record identifier |
| `document_id` | Shared document; references `documents.id` |
| `user_id` | Collaborator; references `users.id` |
| `permission` | `view` or `edit` access level |
| `created_at`, `updated_at` | Timestamps |

Each document and collaborator pair is unique. Foreign keys cascade on deletion. `DocumentPolicy` lets owners manage their documents and allows collaborators to edit only when their pivot permission is `edit`.

## Scope tradeoffs

The editor uses debounced auto-save to persist edits reliably with the current stack. Realtime cursors, presence indicators, simultaneous edit merging, and version history are out of scope; if multiple people edit at once, the most recent save wins. This keeps the collaboration model lightweight without requiring a WebSocket service.
