"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions";

export function AuthForm({ mode, action }: { mode: "login" | "signup"; action: (state: FormState, data: FormData) => Promise<FormState> }) {
  const [state, formAction, pending] = useActionState(action, {});
  const signup = mode === "signup";
  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <section className="card w-full max-w-md p-7 sm:p-9">
      <p className="text-sm font-bold tracking-[.14em] text-emerald-800">SIS</p>
      <h1 className="mt-3 text-3xl font-semibold">{signup ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-2 text-slate-600">{signup ? "Start your CLAT 2027 preparation profile." : "Continue your CLAT preparation."}</p>
      <form action={formAction} className="mt-7 space-y-5">
        {signup && <label className="block text-sm font-medium">Full name<input className="field mt-2" name="fullName" autoComplete="name" required /></label>}
        <label className="block text-sm font-medium">Email<input className="field mt-2" name="email" type="email" autoComplete="email" required /></label>
        <label className="block text-sm font-medium">Password<input className="field mt-2" name="password" type="password" minLength={signup ? 8 : undefined} autoComplete={signup ? "new-password" : "current-password"} required /></label>
        {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
        {state.success && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{state.success}</p>}
        <button className="button w-full" disabled={pending}>{pending ? "Please wait…" : signup ? "Create account" : "Log in"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">{signup ? "Already have an account?" : "New to SIS?"} <Link className="font-semibold text-emerald-800 underline" href={signup ? "/login" : "/signup"}>{signup ? "Log in" : "Sign up"}</Link></p>
    </section>
  </main>;
}
