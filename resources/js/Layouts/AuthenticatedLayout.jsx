import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="min-h-screen bg-[#f5f4f0] text-slate-900 antialiased">
            <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <div className="flex items-center gap-10">
                        <Link href={route('documents.index')} className="group flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-indigo-900/15 transition group-hover:rotate-[-5deg]">a</span>
                            <span className="leading-tight"><span className="block text-[15px] font-bold tracking-[0.14em] text-slate-900">AJAIA</span><span className="block text-[10px] font-medium tracking-[0.2em] text-slate-400">IDEA STUDIO</span></span>
                        </Link>
                        <div className="hidden h-8 w-px bg-slate-200 md:block" />
                        <Link href={route('documents.index')} className="hidden items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 md:flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Workspace
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="text-[11px] text-slate-400">Personal workspace</p></div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button type="button" aria-label="Open account menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ffcf8e] to-[#ff8f8f] text-xs font-bold text-slate-800 ring-4 ring-orange-50 transition hover:scale-105">{initials}</button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200/80">
                                <div className="px-3 py-2"><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-400">{user.email}</p></div>
                                <div className="my-1 border-t border-slate-100" />
                                <Dropdown.Link href={route('profile.edit')} className="rounded-xl text-slate-600 hover:bg-slate-50">Profile settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="rounded-xl text-rose-600 hover:bg-rose-50">Log out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
