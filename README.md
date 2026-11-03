# Ajaia AI-Native Full Stack Developer Submission - Kenneth C. Avila

## Project links

- **Deliverables Drive:** [Google Drive folder](https://drive.google.com/drive/folders/1ZpOclulHO2ytqDcMX3Uel3GtQRTkjWXu)
- **Video Walkthrough:** [Google Drive video](https://drive.google.com/drive/folders/1OrbuDC598iVNNNxDuqK1RjxmyeahL82y)
- **GitHub Repo:** [knnthcstrvl/ajaia-demo](https://github.com/knnthcstrvl/ajaia-demo)

## Environment prerequisites

- PHP **8.3+** (the repository's Composer requirements specify PHP `^8.3`; the original assessment brief lists PHP 8.2+)
- Composer
- Node.js 18+ and npm
- MySQL

The assessment target mentions Laravel 11, but this checkout currently installs Laravel 13.40, Inertia Laravel 2.0, React 18, and Tailwind CSS 3. The implementation and commands below use the versions installed in this repository.

## Installation

Clone the repository and install PHP and JavaScript dependencies:

```bash
git clone https://github.com/knnthcstrvl/ajaia-demo.git ajaia-docs
cd ajaia-docs
composer install
npm install --legacy-peer-deps
```

Copy the example environment file and configure MySQL in `.env`:

```bash
cp .env.example .env
```

Set the database values in `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ajaia_docs
DB_USERNAME=root
DB_PASSWORD=
```

Create the `ajaia_docs` database in MySQL, then generate the application key and initialize the schema and demo data:

```bash
php artisan key:generate
php artisan migrate:fresh --seed
```

> `migrate:fresh` drops all tables in the configured database before recreating them. Use it only with a disposable local database.

Start the Laravel and Vite development servers in separate terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Open `http://127.0.0.1:8000`. Use the **Login as Owner** or **Login as Editor** buttons to enter the demo. The demo login provisions its accounts and sample shared document on first use; running the seeder also creates them.

## Related submission notes

- [Architecture](ARCHITECTURE.md)
- [AI workflow](AI_WORKFLOW.md)
- [Submission features and roadmap](SUBMISSION.md)
