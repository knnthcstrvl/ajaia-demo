import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#f5f4f0] lg:grid lg:grid-cols-2">
            <aside className="relative hidden min-h-screen overflow-hidden bg-[#191827] px-12 py-10 text-white lg:flex lg:flex-col xl:px-20">
                <div className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-violet-600/30 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-[100px]" />
                <Link href="/login" className="relative flex w-fit items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-black">a</span><span><span className="block text-sm font-bold tracking-[0.17em]">AJAIA</span><span className="block text-[9px] font-medium tracking-[0.22em] text-slate-400">IDEA STUDIO</span></span></Link>
                <div className="relative my-auto max-w-xl py-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/> A calmer kind of collaboration</div>
                    <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">Make space for <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">the good ideas.</span></h1>
                    <p className="mt-6 max-w-md text-base leading-7 text-slate-300">A thoughtful little workspace for the things you want to make, share, and bring to life.</p>
                    <div className="mt-12 max-w-md rounded-[24px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between"><div className="flex -space-x-2"><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#252337] bg-orange-200 text-xs font-bold text-orange-900">K</span><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#252337] bg-cyan-200 text-xs font-bold text-cyan-900">A</span><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#252337] bg-fuchsia-200 text-xs font-bold text-fuchsia-900">+</span></div><span className="rounded-full bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold text-emerald-200">YOUR SPACE IS READY</span></div>
                        <p className="mt-5 text-sm font-medium leading-6 text-white">“The best work happens when there’s room to think together.”</p>
                        <p className="mt-2 text-xs text-slate-400">Ajaia workspace</p>
                    </div>
                </div>
                <p className="relative text-xs text-slate-500">Ajaia Docs <span className="px-2 text-slate-700">/</span> Make something meaningful.</p>
            </aside>
            <main className="relative flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
                <Link href="/login" className="absolute left-6 top-7 flex items-center gap-2 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 font-black text-white">a</span><span className="text-xs font-bold tracking-[0.16em] text-slate-800">AJAIA</span></Link>
                <div className="mx-auto mt-10 w-full max-w-[430px] rounded-[28px] border border-white/80 bg-white p-6 shadow-xl shadow-slate-900/[0.06] sm:p-9 lg:mt-0">
                    {children}
                </div>
                <p className="mt-7 text-center text-[11px] text-slate-400">A little space for big ideas.</p>
            </main>
        </div>
    );
}
