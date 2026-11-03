<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function demo(Request $request): RedirectResponse
    {
        $validated = $request->validate(['role' => ['required', 'in:owner,editor']]);
        $user = DB::transaction(function () use ($validated): User {
            $owner = User::firstOrCreate(
                ['email' => 'owner@ajaia.com'],
                ['name' => 'Kenneth Avila', 'password' => 'password', 'email_verified_at' => now()],
            );
            $editor = User::firstOrCreate(
                ['email' => 'editor@ajaia.com'],
                ['name' => 'Ajaia Editor', 'password' => 'password', 'email_verified_at' => now()],
            );
            $document = Document::firstOrCreate(
                ['user_id' => $owner->id, 'title' => 'Welcome to Ajaia Docs'],
                ['content' => '<h1>Your ideas, in sync.</h1><p>This shared workspace is ready for you to explore. Try editing this document, or create one of your own.</p><ul><li>Use the toolbar to format your writing</li><li>Changes save automatically</li><li>Import a Markdown or text file from your workspace</li></ul>'],
            );
            $document->collaborators()->syncWithoutDetaching([$editor->id => ['permission' => 'edit']]);

            return $validated['role'] === 'owner' ? $owner : $editor;
        });
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('documents.index');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
