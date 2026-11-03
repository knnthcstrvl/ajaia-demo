import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ documents }) {
    const createForm = useForm({ title: '', content: '' });
    const importForm = useForm({ file: null });

    function createDocument(event) {
        event.preventDefault();
        createForm.post(route('documents.store'), { onSuccess: () => createForm.reset() });
    }

    function importDocument(event) {
        event.preventDefault();
        importForm.post(route('documents.import'), { forceFormData: true, onSuccess: () => importForm.reset() });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Your documents" />
            <div className="min-h-screen bg-[#f7f8fc] px-5 py-10 sm:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Ajaia workspace</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your documents</h1>
                            <p className="mt-2 text-slate-500">A quiet place for your best thinking.</p>
                        </div>
                        <form onSubmit={createDocument} className="flex w-full gap-2 sm:w-auto">
                            <input aria-label="New document title" value={createForm.data.title} onChange={(event) => createForm.setData('title', event.target.value)} placeholder="Name your document" className="min-w-0 flex-1 rounded-xl border-slate-200 bg-white px-4 text-sm shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:w-56" />
                            <button disabled={createForm.processing} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">New document</button>
                        </form>
                    </div>
                    <form onSubmit={importDocument} className="mt-8 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div><p className="text-sm font-semibold text-slate-800">Bring in a draft</p><p className="mt-1 text-sm text-slate-500">Import a plain text or Markdown file to start editing.</p></div>
                        <div className="flex items-center gap-3"><input aria-label="Choose a text or Markdown file" type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event) => importForm.setData('file', event.target.files[0])} className="max-w-56 text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700" /><button disabled={importForm.processing || !importForm.data.file} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Import file</button></div>
                    </form>
                    {importForm.errors.file && <p className="mt-2 text-sm text-rose-600">{importForm.errors.file}</p>}
                    <div className="mt-8 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-700">Recent documents <span className="ml-1 text-slate-400">{documents.length}</span></h2><span className="text-xs text-slate-400">Sorted by recent activity</span></div>
                    {documents.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {documents.map((document) => <Link key={document.id} href={route('documents.edit', document.id)} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                            <div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7"><path d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z"/><path d="M14 4v5h5M9 14h6M9 17h6"/></svg></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-600">{document.permission}</span></div>
                            <h3 className="mt-5 truncate font-semibold text-slate-900 group-hover:text-indigo-700">{document.title}</h3><p className="mt-1 text-sm text-slate-500">{document.owner} · {document.updatedAt}</p>
                        </Link>)}
                    </div> : <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><span className="text-2xl">✦</span></div><h3 className="mt-4 font-semibold text-slate-900">Your first page is waiting</h3><p className="mt-1 text-sm text-slate-500">Create a document above, or bring in a draft from your computer.</p></div>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
