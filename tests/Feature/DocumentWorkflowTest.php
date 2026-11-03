<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class DocumentWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_edit_and_reopen_a_document(): void
    {
        $owner = User::factory()->create();
        $this->actingAs($owner)->post(route('documents.store'), ['title' => 'Planning', 'content' => '<p>First draft</p>'])
            ->assertRedirect();
        $document = Document::firstOrFail();

        $this->actingAs($owner)->put(route('documents.update', $document), [
            'title' => 'Updated plan', 'content' => '<h1>Plan</h1><p onclick="alert(1)">Safe <strong>format</strong></p><script>alert(1)</script>',
        ])->assertRedirect();

        $this->assertDatabaseHas('documents', ['id' => $document->id, 'title' => 'Updated plan']);
        $this->assertStringContainsString('<strong>format</strong>', $document->fresh()->content);
        $this->assertStringNotContainsString('<script', $document->fresh()->content);
        $this->assertStringNotContainsString('onclick', $document->fresh()->content);
        $this->actingAs($owner)->get(route('documents.edit', $document))->assertOk();
    }

    public function test_owner_can_create_a_blank_document(): void
    {
        $owner = User::factory()->create();

        $this->actingAs($owner)->post(route('documents.store'), ['title' => 'Untitled document'])
            ->assertRedirect();

        $this->assertDatabaseHas('documents', [
            'user_id' => $owner->id,
            'title' => 'Untitled document',
            'content' => '',
        ]);
    }

    public function test_shared_viewer_can_read_but_cannot_edit_document(): void
    {
        $owner = User::factory()->create();
        $viewer = User::factory()->create();
        $document = Document::factory()->create(['user_id' => $owner->id]);
        $document->collaborators()->attach($viewer->id, ['permission' => 'view']);

        $this->actingAs($viewer)->get(route('documents.edit', $document))->assertOk();
        $this->actingAs($viewer)->put(route('documents.update', $document), ['content' => '<p>Unauthorized</p>'])->assertForbidden();
        $this->assertStringNotContainsString('Unauthorized', $document->fresh()->content);
    }

    public function test_shared_editor_can_update_document(): void
    {
        $owner = User::factory()->create();
        $editor = User::factory()->create();
        $document = Document::factory()->create(['user_id' => $owner->id]);
        $document->collaborators()->attach($editor->id, ['permission' => 'edit']);

        $this->actingAs($editor)->put(route('documents.update', $document), ['content' => '<p>Edited together</p>'])->assertRedirect();
        $this->assertSame('<p>Edited together</p>', $document->fresh()->content);
    }

    public function test_unshared_user_cannot_open_document(): void
    {
        $document = Document::factory()->create();

        $this->actingAs(User::factory()->create())->get(route('documents.edit', $document))->assertForbidden();
    }

    public function test_editor_can_use_demo_login_and_import_markdown(): void
    {
        $this->post(route('demo.login'), ['role' => 'editor'])->assertRedirect(route('documents.index'));
        $editor = User::where('email', 'editor@ajaia.com')->firstOrFail();
        $this->assertAuthenticatedAs($editor);
        $this->assertDatabaseHas('documents', ['user_id' => User::where('email', 'owner@ajaia.com')->value('id'), 'title' => 'Welcome to Ajaia Docs']);

        $this->post(route('documents.import'), ['file' => UploadedFile::fake()->createWithContent('notes.md', "# Hello\nA draft")])
            ->assertRedirect();
        $this->assertDatabaseHas('documents', ['user_id' => $editor->id, 'title' => 'notes', 'content' => '<h1>Hello</h1><p>A draft</p>']);
    }
}
