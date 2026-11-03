import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const cardAccents = [
    'from-violet-100 via-fuchsia-50 to-white text-violet-700',
    'from-amber-100 via-orange-50 to-white text-orange-700',
    'from-cyan-100 via-sky-50 to-white text-cyan-700',
    'from-rose-100 via-pink-50 to-white text-rose-700',
];

export default function Index({ documents }) {
    const [activeTab, setActiveTab] = useState('all');
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const createForm = useForm({ title: '', content: '' });
    const importForm = useForm({ file: null });
    const ownedDocuments = documents.filter((document) => document.permission === 'owner');
    const sharedDocuments = documents.filter((document) => document.permission !== 'owner');
    const visibleDocuments = activeTab === 'owned' ? ownedDocuments : activeTab === 'shared' ? sharedDocuments : documents;
    const tabs = [
        { id: 'all', label: 'Everything', count: documents.length },
        { id: 'owned', label: 'Made by me', count: ownedDocuments.length },
        { id: 'shared', label: 'Shared with me', count: sharedDocuments.length },
    ];

    function createDocument(event) {
        event.preventDefault();
        createForm.post(route('documents.store'), { onSuccess: () => createForm.reset() });
    }

    function importDocument(event) {
        event.preventDefault();
        importForm.post(route('documents.import'), { forceFormData: true, onSuccess: () => importForm.reset() });
    }

    function deleteDocument() {
        if (!documentToDelete || deleting) return;
        setDeleting(true);
        router.delete(route('documents.destroy', documentToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setDocumentToDelete(null),
            onFinish: () => setDeleting(false),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Your workspace" />
            <div className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden px-5 pb-20 pt-8 sm:px-8 sm:pt-10">
                <div className="pointer-events-none absolute -right-40 top-10 -z-10 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-[100px]" />
                <div className="pointer-events-none absolute -left-40 top-[30rem] -z-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-[100px]" />
                <div className="mx-auto max-w-7xl">
                    <section className="relative overflow-hidden rounded-[30px] bg-[#191827] px-7 py-8 text-white shadow-2xl shadow-indigo-950/10 sm:px-10 sm:py-10 lg:px-12">
                        <div className="pointer-events-none absolute -right-16 -top-36 h-[30rem] w-[30rem] rounded-full bg-violet-600/30 blur-[80px]" />
                        <div className="pointer-events-none absolute right-1/3 top-20 h-40 w-40 rounded-full bg-cyan-400/15 blur-[60px]" />
                        <div className="relative grid items-center gap-10 lg:grid-cols-[1.25fr_.75fr]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.17em] text-violet-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_2px_rgba(110,231,183,.7)]" /> Your idea studio</div>
                                <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">A little space for <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">big ideas.</span></h1>
                                <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">Capture a thought, shape it with your team, and watch the good work take form.</p>
                                <form onSubmit={createDocument} className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.08] p-2 backdrop-blur sm:flex-row">
                                    <input aria-label="New document title" value={createForm.data.title} onChange={(event) => createForm.setData('title', event.target.value)} placeholder="Give your next idea a name..." className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-violet-400/60" />
                                    <button disabled={createForm.processing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:opacity-60"><span className="text-lg leading-none">+</span> New document</button>
                                </form>
                                {createForm.errors.title && <p className="mt-2 text-sm text-rose-200">{createForm.errors.title}</p>}
                            </div>
                            <div className="relative hidden min-h-[230px] items-center justify-center lg:flex">
                                <div className="absolute h-48 w-48 rounded-full border border-white/10" /><div className="absolute h-64 w-64 rounded-full border border-dashed border-white/10" />
                                <div className="absolute right-6 top-1 rounded-2xl border border-white/10 bg-[#29263c] px-4 py-3 shadow-xl shadow-black/20 -rotate-6"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300"/><span className="text-[11px] font-medium text-slate-200">Auto-save is on</span></div></div>
                                <div className="relative w-64 rotate-3 rounded-[22px] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-cyan-300 text-sm font-bold text-white">A</div><div className="mt-5 h-2 w-24 rounded-full bg-white/70"/><div className="mt-2 h-1.5 w-40 rounded-full bg-white/25"/><div className="mt-2 h-1.5 w-32 rounded-full bg-white/20"/><div className="mt-5 flex gap-2"><span className="h-8 flex-1 rounded-lg bg-violet-400/30"/><span className="h-8 w-8 rounded-lg bg-cyan-300/30"/></div>
                                    <div className="absolute -bottom-5 -right-6 flex -space-x-2"><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#242237] bg-orange-200 text-xs font-bold text-orange-900">K</span><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#242237] bg-cyan-200 text-xs font-bold text-cyan-900">A</span><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#242237] bg-fuchsia-200 text-xs font-bold text-fuchsia-900">+</span></div>
                                </div>
                                <div className="absolute bottom-0 left-6 rounded-2xl border border-white/10 bg-[#29263c] px-4 py-3 shadow-xl shadow-black/20 rotate-3"><p className="text-[10px] uppercase tracking-widest text-slate-400">Good things grow</p><p className="mt-1 text-xs font-medium text-white">when ideas are shared.</p></div>
                            </div>
                        </div>
                    </section>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {[
                            { label: 'All your pages', count: documents.length, icon: '✳', color: 'text-violet-600 bg-violet-50' },
                            { label: 'Created by you', count: ownedDocuments.length, icon: '↗', color: 'text-orange-600 bg-orange-50' },
                            { label: 'Shared with you', count: sharedDocuments.length, icon: '♡', color: 'text-cyan-700 bg-cyan-50' },
                        ].map((stat) => <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm shadow-slate-900/[0.02]"><span className={'flex h-10 w-10 items-center justify-center rounded-xl text-lg ' + stat.color}>{stat.icon}</span><div><p className="text-2xl font-semibold tracking-tight text-slate-900">{stat.count}</p><p className="text-xs text-slate-500">{stat.label}</p></div></div>)}
                    </div>

                    <form onSubmit={importDocument} className="mt-7 flex flex-col gap-4 rounded-[22px] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 text-amber-700"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 16V4m0 0L8 8m4-4 4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><div><p className="text-sm font-semibold text-slate-900">Already have a draft?</p><p className="mt-1 text-sm text-slate-500">Bring in a .txt or .md file and keep the momentum going.</p></div></div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center"><input aria-label="Choose a text or Markdown file" type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event) => importForm.setData('file', event.target.files[0])} className="max-w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 sm:max-w-64"/><button disabled={importForm.processing || !importForm.data.file} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50">Import draft</button></div>
                    </form>
                    {importForm.errors.file && <p className="mt-2 text-sm text-rose-600">{importForm.errors.file}</p>}

                    <section className="mt-12">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Your library</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Documents <span className="ml-1 align-middle text-sm font-medium text-slate-400">{visibleDocuments.length}</span></h2></div><p className="text-xs text-slate-400">Your latest work, right where you left it</p></div>
                        <div role="tablist" aria-label="Document categories" className="mt-6 flex gap-2 overflow-x-auto pb-1">
                            {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ' + (activeTab === tab.id ? 'bg-[#211d36] text-white shadow-md shadow-indigo-950/10' : 'border border-slate-200 bg-white/70 text-slate-500 hover:border-violet-200 hover:text-violet-700')}>
                                {tab.label}<span className={'rounded-full px-2 py-0.5 text-[11px] ' + (activeTab === tab.id ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500')}>{tab.count}</span>
                            </button>)}
                        </div>
                        {visibleDocuments.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {visibleDocuments.map((document, index) => <article key={document.id} className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-950/[0.08]">
                                <div className={'relative h-36 overflow-hidden bg-gradient-to-br ' + cardAccents[index % cardAccents.length]}>
                                    <div className="absolute -right-8 -top-16 h-44 w-44 rounded-full border border-current/10 opacity-50"/><div className="absolute -right-1 -top-9 h-36 w-36 rounded-full border border-current/10 opacity-50"/>
                                    <div className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 shadow-sm backdrop-blur"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z"/><path d="M14 4v5h5M9 14h6M9 17h6"/></svg></div>
                                    <div className="absolute bottom-5 left-6 right-6 space-y-2 opacity-40"><div className="h-1.5 w-2/5 rounded-full bg-current"/><div className="h-1 w-4/5 rounded-full bg-current"/><div className="h-1 w-3/5 rounded-full bg-current"/></div>
                                    <span className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[10px] font-semibold capitalize text-slate-600 backdrop-blur">{document.permission === 'owner' ? 'Your document' : document.permission + ' access'}</span>
                                    {document.permission === 'owner' && <button type="button" aria-label={'Delete ' + document.title} title="Delete document" onClick={() => setDocumentToDelete(document)} className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/75 text-slate-500 opacity-100 shadow-sm backdrop-blur transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}
                                </div>
                                <Link href={route('documents.edit', document.id)} className="block p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500">
                                    <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 transition group-hover:text-violet-700">{document.title}</h3>
                                    <div className="mt-3 flex items-center justify-between gap-3"><p className="truncate text-xs text-slate-500">{document.permission === 'owner' ? 'Created by you' : 'From ' + document.owner}</p><p className="shrink-0 text-[11px] text-slate-400">{document.updatedAt}</p></div>
                                </Link>
                            </article>)}
                        </div> : <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-50 text-2xl text-violet-600">✳</span><h3 className="mt-5 text-lg font-semibold text-slate-900">{documents.length === 0 ? 'Your first idea starts here' : activeTab === 'owned' ? 'Nothing created just yet' : activeTab === 'shared' ? 'Your shared space is quiet' : 'No documents found'}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{documents.length === 0 ? 'Start with a blank page above or import a draft you have already started.' : activeTab === 'owned' ? 'Create a page above and make this space yours.' : activeTab === 'shared' ? 'When someone invites you to a document, it will show up here.' : 'Choose another view to see your documents.'}</p></div>}
                    </section>
                </div>
            </div>

            {documentToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151321]/50 px-5 py-8 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDocumentToDelete(null); }}>
                <section role="dialog" aria-modal="true" aria-labelledby="delete-document-title" className="w-full max-w-md rounded-[26px] border border-white/50 bg-white p-7 shadow-2xl shadow-black/20">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    <h2 id="delete-document-title" className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Delete this document?</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500"><span className="font-medium text-slate-700">{documentToDelete.title}</span> will be permanently removed for you and everyone it was shared with.</p>
                    <div className="mt-7 flex justify-end gap-2"><button type="button" disabled={deleting} onClick={() => setDocumentToDelete(null)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">Keep document</button><button type="button" disabled={deleting} onClick={deleteDocument} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50">{deleting ? 'Deleting...' : 'Delete permanently'}</button></div>
                </section>
            </div>}
        </AuthenticatedLayout>
    );
}
