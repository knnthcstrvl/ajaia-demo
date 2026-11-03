import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const tools = [
    ['bold', 'Bold', 'B'], ['italic', 'Italic', 'I'], ['underline', 'Underline', 'U'],
];

export default function Edit({ document, owner, collaborators, canEdit, canShare }) {
    const form = useForm({ title: document.title, content: document.content ?? '' });
    const [saveState, setSaveState] = useState('All changes saved');
    const [shareOpen, setShareOpen] = useState(false);
    const editorRef = useRef(null);
    const shareForm = useForm({ email: '', permission: 'edit' });
    const initial = useRef(JSON.stringify({ title: document.title, content: document.content ?? '' }));

    useEffect(() => {
        if (!canEdit || initial.current === JSON.stringify(form.data)) return;
        setSaveState('Saving…');
        const timeout = window.setTimeout(() => {
            router.put(route('documents.update', document.id), form.data, {
                preserveScroll: true,
                onSuccess: () => { initial.current = JSON.stringify(form.data); setSaveState('All changes saved'); },
                onError: () => setSaveState('Could not save changes'),
            });
        }, 700);
        return () => window.clearTimeout(timeout);
    }, [form.data.title, form.data.content, canEdit, document.id]);

    function format(command, value = null) {
        editorRef.current?.focus();
        window.document.execCommand(command, false, value);
        form.setData('content', editorRef.current?.innerHTML ?? '');
    }

    function shareDocument(event) {
        event.preventDefault();
        shareForm.post(route('documents.share', document.id), { preserveScroll: true, onSuccess: () => { shareForm.reset('email'); setShareOpen(false); router.reload({ only: ['collaborators'] }); } });
    }

    return (
        <AuthenticatedLayout>
        <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-b from-[#f0eef9] via-[#f7f6f3] to-[#f7f6f3] text-slate-800">
            <Head title={document.title} />
            <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-violet-200/40 blur-[90px]" />
            <header className="relative z-10 border-b border-white/70 bg-white/65 backdrop-blur-xl">
                <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
                    <div className="flex min-w-0 items-center gap-3"><Link href={route('documents.index')} aria-label="Back to documents" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-x-0.5 hover:text-violet-700">←</Link><div className="min-w-0"><div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-violet-600">Ajaia workspace / document</div><input aria-label="Document title" value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} disabled={!canEdit} className="w-full truncate border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 focus:ring-0 disabled:text-slate-600 sm:max-w-sm" /><p className="text-[11px] text-slate-400">{saveState}</p></div></div>
                    <div className="flex items-center gap-2"><div className="hidden text-right sm:block"><p className="text-xs font-medium text-slate-700">{owner.name}</p><p className="text-[10px] text-slate-400">Document owner</p></div>{canShare && <button onClick={() => setShareOpen(!shareOpen)} className="rounded-xl bg-[#211d36] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/10 transition hover:bg-violet-700">Share</button>}</div>
                </div>
                {shareOpen && <div className="absolute right-4 top-[60px] z-30 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"><div className="flex items-start justify-between"><div><h3 className="font-semibold text-slate-900">Share document</h3><p className="mt-1 text-xs text-slate-500">Invite someone in your workspace.</p></div><button aria-label="Close sharing" onClick={() => setShareOpen(false)} className="text-slate-400">×</button></div><form onSubmit={shareDocument} className="mt-4 space-y-3"><input type="email" required value={shareForm.data.email} onChange={(event) => shareForm.setData('email', event.target.value)} placeholder="colleague@example.com" className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400"/><div className="flex gap-2"><select value={shareForm.data.permission} onChange={(event) => shareForm.setData('permission', event.target.value)} className="flex-1 rounded-lg border-slate-200 text-sm"><option value="edit">Can edit</option><option value="view">Can view</option></select><button disabled={shareForm.processing} className="rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-50">Invite</button></div>{shareForm.errors.email && <p className="text-xs text-rose-600">{shareForm.errors.email}</p>}</form><div className="mt-5 border-t border-slate-100 pt-4"><p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">People with access</p><div className="space-y-3"><div className="flex items-center justify-between"><span className="truncate pr-2 text-xs text-slate-700">{owner.email}</span><span className="text-[11px] text-slate-400">Owner</span></div>{collaborators.map((person) => <div key={person.id} className="flex items-center justify-between"><span className="truncate pr-2 text-xs text-slate-700">{person.email}</span><span className="text-[11px] capitalize text-slate-400">{person.permission}</span></div>)}</div></div></div>}
            </header>
            <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-7 sm:pt-10">
                <div className="mb-5 flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-white bg-white/85 px-2 py-2 shadow-lg shadow-slate-900/[0.04] backdrop-blur">
                    <button type="button" onClick={() => format('formatBlock', 'h1')} disabled={!canEdit} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">Heading 1</button><button type="button" onClick={() => format('formatBlock', 'h2')} disabled={!canEdit} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">Heading 2</button><span className="mx-1 h-6 border-l border-slate-200" />
                    {tools.map(([command, label, text]) => <button key={command} type="button" aria-label={label} title={label} onClick={() => format(command)} disabled={!canEdit} className={`min-w-9 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 ${command === 'italic' ? 'italic' : ''} ${command === 'underline' ? 'underline' : ''} ${command === 'bold' ? 'font-bold' : ''}`}>{text}</button>)}<span className="mx-1 h-6 border-l border-slate-200" />
                    <button type="button" onClick={() => format('insertUnorderedList')} disabled={!canEdit} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40">• List</button><button type="button" onClick={() => format('insertOrderedList')} disabled={!canEdit} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40">1. List</button>
                </div>
                <section className="mx-auto min-h-[68vh] max-w-[850px] rounded-[26px] border border-white bg-white px-7 py-12 shadow-xl shadow-slate-900/[0.06] sm:px-16 sm:py-16">
                    <div ref={editorRef} contentEditable={canEdit} suppressContentEditableWarning onInput={(event) => form.setData('content', event.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: document.content ?? '' }} className={`document-editor min-h-[55vh] text-[16px] leading-8 text-slate-700 outline-none ${canEdit ? 'cursor-text' : ''}`} />
                    {!canEdit && <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">You have view-only access to this document.</p>}
                </section>
            </section>
        </div>
        </AuthenticatedLayout>
    );
}
