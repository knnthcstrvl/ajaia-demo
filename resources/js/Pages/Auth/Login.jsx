import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [demoProcessing, setDemoProcessing] = useState(false);
    const loginAs = (role) => {
        router.post(route('demo.login'), { role }, {
            onStart: () => setDemoProcessing(true),
            onFinish: () => setDemoProcessing(false),
        });
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-violet-600">Welcome back</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Pick up where you left off.</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">Your ideas are right where you left them.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="relative mb-7 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4">
                <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">✦</span><div><p className="text-sm font-semibold text-slate-900">Take a quick look around</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Jump in as an owner or collaborator.</p></div></div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => loginAs('owner')} disabled={demoProcessing} className="rounded-xl bg-[#211d36] px-3 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-950/10 transition hover:bg-violet-700 disabled:opacity-60">Explore as owner</button>
                    <button type="button" onClick={() => loginAs('editor')} disabled={demoProcessing} className="rounded-xl border border-violet-200 bg-white/80 px-3 py-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-white disabled:opacity-60">Explore as editor</button>
                </div>
            </div>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-violet-400 focus:ring-violet-400"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-violet-400 focus:ring-violet-400"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <button className="ms-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-indigo-900/15 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50" disabled={processing}>Log in</button>
                </div>
            </form>
            <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">New to Ajaia? <Link href={route('register')} className="font-semibold text-violet-700 hover:text-violet-900">Create an account</Link></p>
        </GuestLayout>
    );
}
