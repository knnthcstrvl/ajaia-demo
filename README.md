# Ajaia AI-Native Full Stack Developer Submission - Kenneth C. Avila

- **Google Drive Deliverables Folder:** https://drive.google.com/drive/folders/1ZpOclulHO2ytqDcMX3Uel3GtQRTkjWXu
- **Walkthrough Video Link:** https://drive.google.com/drive/folders/1OrbuDC598iVNNNxDuqK1RjxmyeahL82y
- **Live Deployment Link:** N/A (Configured for Local Execution)
- **Demo Access:** Use the instant **Login as Owner** (`owner@ajaia.com`) or **Login as Editor** (`editor@ajaia.com`) buttons on the login page. Both seeded accounts use `password` for manual sign-in.

## 1. Local Setup Instructions

### Requirements

- PHP 8.3+, Composer
- Node.js 18+, npm
- MySQL 8+ (or a compatible local MySQL installation)

> The submitted target was Laravel 11; this repository currently installs Laravel 13.40, Inertia Laravel 2.0, React 18, and Tailwind CSS 3. Build and run commands below use the versions installed here.

### Install and configure

```bash
git clone https://github.com/knnthcstrvl/ajaia-demo.git ajaia-docs
cd ajaia-docs
composer install
npm install --legacy-peer-deps
```

Copy `.env.example` to `.env`, then set the local database connection:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ajaia_docs
DB_USERNAME=root
DB_PASSWORD=
```

Create the `ajaia_docs` database, then prepare the app and demo data:

```bash
php artisan key:generate
php artisan migrate --seed
```

For a clean local database reset, use `php artisan migrate:fresh --seed` (this deletes existing tables and data).

Run both development servers in separate terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Open `http://127.0.0.1:8000`. The seeder creates the owner and editor demo accounts and a shared sample document.

## 2. Architecture Note

### Stack

- **Laravel + Inertia:** Server-side routes, validation, Eloquent persistence, and authorization with a React client and no separate API layer.
- **React + Tailwind CSS:** A responsive editor and workspace UI built with the dependencies already installed in the repository.
- **MySQL:** Relational ownership and collaboration data, with rich-text HTML stored in `LONGTEXT`.

### Data model and access

- `documents`: `id`, `user_id` (owner), `title`, `content`, timestamps.
- `document_user`: `id`, `document_id`, `user_id` (collaborator), `permission` (`view` or `edit`), timestamps and a unique document/user pair.
- `DocumentPolicy` permits owners and collaborators to open documents, grants edits only to owners and `edit` collaborators, and limits sharing/deletion to owners.
- Rich text is sanitized server-side to a small formatting allowlist before it is persisted and rendered.

### Deliberate scope

Autosave persists edits without a realtime transport. Simultaneous editing does not currently include live cursors, presence, or conflict resolution; the last saved update wins.

## 3. AI Workflow & Orchestration Note

- **Claude:** High-level architecture, UI layout, and initial policy structure.
- **OpenAI Codex / ChatGPT:** React components, Laravel routes/controllers, migrations, and feature tests.
- **Gemini:** Step-by-step debugging and package dependency troubleshooting.

## 4. Feature Breakdown & Submission Status

- **Implemented:** Document creation, rename, rich-text editing (bold, italic, underline, headings, ordered and unordered lists), autosave, reopen, TXT/Markdown import, owner/editor sharing, view/edit policy enforcement, demo login buttons, and feature tests.
- **Not included:** Realtime multi-cursor editing and version history.
- **Next 2–4 hours:** Add Laravel Reverb presence/collaboration and version history snapshots.
