<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $owner = User::updateOrCreate(['email' => 'owner@ajaia.com'], ['name' => 'Kenneth Avila', 'password' => 'password', 'email_verified_at' => now()]);
        $editor = User::updateOrCreate(['email' => 'editor@ajaia.com'], ['name' => 'Ajaia Editor', 'password' => 'password', 'email_verified_at' => now()]);
        $document = $owner->documents()->updateOrCreate(['title' => 'Welcome to Ajaia Docs'], [
            'content' => '<h1>Your ideas, in sync.</h1><p>This shared workspace is ready for you to explore. Try editing this document, or create one of your own.</p><ul><li>Use the toolbar to format your writing</li><li>Changes save automatically</li><li>Import a Markdown or text file from your workspace</li></ul>',
        ]);
        $document->collaborators()->syncWithoutDetaching([$editor->id => ['permission' => 'edit']]);
    }
}
