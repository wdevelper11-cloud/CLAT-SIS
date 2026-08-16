"use client";
import { useActionState } from "react";
import { onboard } from "@/app/actions";

export function OnboardingForm() {
  const [state, action, pending] = useActionState(onboard, {});
  return <form action={action} className="mt-8 space-y-5">
    <label className="block text-sm font-medium">Target Score <span className="font-normal text-slate-500">(optional)</span><input className="field mt-2" name="targetScore" type="number" min="0.01" max="9999.99" step="0.01" /></label>
    <label className="block text-sm font-medium">Daily Study Time <span className="font-normal text-slate-500">(minutes, optional)</span><input className="field mt-2" name="dailyStudyMinutes" type="number" min="1" step="1" /></label>
    {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    <button className="button w-full" disabled={pending}>{pending ? "Saving…" : "Start SIS"}</button>
  </form>;
}
