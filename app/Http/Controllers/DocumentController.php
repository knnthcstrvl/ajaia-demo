<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $documents = Document::query()->with([
            'owner:id,name',
            'collaborators' => fn ($query) => $query->whereKey($user->id),
        ])
            ->where('user_id', $user->id)->orWhereHas('collaborators', fn ($query) => $query->whereKey($user->id))
            ->latest('updated_at')->get()->map(fn (Document $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'updatedAt' => $document->updated_at->diffForHumans(),
                'owner' => $document->owner->name,
                'permission' => $document->user_id === $user->id ? 'owner' : $document->collaborators->first()?->pivot->permission,
            ]);

        return Inertia::render('Documents/Index', ['documents' => $documents]);
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $document = $request->user()->documents()->create([
            'title' => $request->validated('title'),
            'content' => $this->sanitizeHtml($request->validated('content') ?? ''),
        ]);

        return redirect()->route('documents.edit', $document);
    }

    public function edit(Document $document): Response
    {
        Gate::authorize('view', $document);
        $user = request()->user();
        $isOwner = $document->user_id === $user->id;

        return Inertia::render('Documents/Edit', [
            'document' => $document->only(['id', 'title', 'content', 'updated_at']),
            'owner' => $document->owner()->first(['id', 'name', 'email']),
            'collaborators' => $isOwner ? $document->collaborators()->get(['users.id', 'users.name', 'users.email'])->map(fn (User $collaborator): array => [
                'id' => $collaborator->id, 'name' => $collaborator->name, 'email' => $collaborator->email, 'permission' => $collaborator->pivot->permission,
            ]) : [],
            'canEdit' => Gate::allows('update', $document),
            'canShare' => Gate::allows('share', $document),
        ]);
    }

    public function update(UpdateDocumentRequest $request, Document $document): RedirectResponse
    {
        $data = $request->validated();
        if (array_key_exists('content', $data)) {
            $data['content'] = $this->sanitizeHtml($data['content'] ?? '');
        }
        $document->update($data);

        return back();
    }

    public function destroy(Document $document): RedirectResponse
    {
        Gate::authorize('delete', $document);
        $document->delete();

        return redirect()->route('documents.index');
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate(['file' => ['required', 'file', 'mimes:txt,md', 'max:5120']]);
        $file = $validated['file'];
        $content = mb_convert_encoding(file_get_contents($file->getRealPath()), 'UTF-8', 'UTF-8');
        $title = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $html = $this->markdownToHtml($content);
        $document = $request->user()->documents()->create(['title' => mb_substr($title ?: 'Imported document', 0, 160), 'content' => $html]);

        return redirect()->route('documents.edit', $document);
    }

    public function share(Request $request, Document $document): RedirectResponse
    {
        Gate::authorize('share', $document);
        $validated = $request->validate(['email' => ['required', 'email', 'exists:users,email'], 'permission' => ['required', 'in:view,edit']]);
        $collaborator = User::where('email', $validated['email'])->firstOrFail();
        abort_if($collaborator->is($document->owner), 422, 'The owner already has full access.');
        $document->collaborators()->syncWithoutDetaching([$collaborator->id => ['permission' => $validated['permission']]]);

        return back();
    }

    private function markdownToHtml(string $markdown): string
    {
        $html = '';
        $inList = false;
        $closeList = function () use (&$html, &$inList): void {
            if ($inList) {
                $html .= '</ul>';
                $inList = false;
            }
        };

        foreach (preg_split('/\R/u', $markdown) ?: [] as $line) {
            $line = trim($line);
            if ($line === '') {
                $closeList();

                continue;
            }

            if (preg_match('/^(#{1,3})\s+(.+)$/u', $line, $heading)) {
                $closeList();
                $level = strlen($heading[1]);
                $html .= '<h'.$level.'>'.$this->markdownInline(e($heading[2])).'</h'.$level.'>';

                continue;
            }

            if (preg_match('/^[-*+]\s+(.+)$/u', $line, $item)) {
                if (! $inList) {
                    $html .= '<ul>';
                    $inList = true;
                }
                $html .= '<li>'.$this->markdownInline(e($item[1])).'</li>';

                continue;
            }

            $closeList();
            $html .= '<p>'.$this->markdownInline(e($line)).'</p>';
        }
        $closeList();

        return $html;
    }

    private function markdownInline(string $escapedText): string
    {
        return preg_replace('/\*\*(.+?)\*\*|__(.+?)__/', '<strong>$1$2</strong>', $escapedText) ?? $escapedText;
    }

    private function sanitizeHtml(string $html): string
    {
        $document = new \DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8"><div>'.$html.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);
        $allowedTags = ['div', 'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote'];
        $root = $document->getElementsByTagName('div')->item(0);
        if (! $root) {
            return '';
        }
        $sanitize = function (\DOMNode $node) use (&$sanitize, $allowedTags): void {
            foreach (iterator_to_array($node->childNodes) as $child) {
                if ($child instanceof \DOMElement) {
                    if (! in_array(strtolower($child->tagName), $allowedTags, true)) {
                        $child->parentNode?->replaceChild($node->ownerDocument->createTextNode($child->textContent), $child);

                        continue;
                    }
                    while ($child->attributes->length > 0) {
                        $child->removeAttributeNode($child->attributes->item(0));
                    }
                }
                $sanitize($child);
            }
        };
        $sanitize($root);
        $output = '';
        foreach ($root->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        return $output;
    }
}
