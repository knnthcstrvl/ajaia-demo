# Submission Features & Roadmap

## Working features

- Document creation, renaming, editing, auto-save, and reopening.
- Rich-text formatting for **bold**, *italic*, underline, headings, and ordered or unordered lists.
- Import `.txt` and `.md` files as editable drafts.
- Owner and collaborator access through the `document_user` pivot table, with `view` and `edit` permissions enforced by a Laravel policy.
- Owner-only document deletion.
- Instant demo login actions on the login screen:
  - **Login as Owner** — `owner@ajaia.com`
  - **Login as Editor** — `editor@ajaia.com`
- Laravel feature tests covering document workflows, access control, demo account provisioning, Markdown import, and rich-text sanitization.

## Import format note

The current upload feature accepts `.txt` and `.md` files. `.docx` import is not implemented in this repository yet and should not be considered a working feature for this submission.

## Deprioritized features and next 2–4 hours

Realtime multi-cursor editing and document version history were deprioritized in favor of reliable auto-save and access control. The next development window could add:

1. Laravel Reverb WebSockets for live presence and collaboration updates.
2. Document version snapshots with a simple history and restore interface.
