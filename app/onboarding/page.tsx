import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await supabase.from("exam_profiles").select("id").eq("user_id", user.id).eq("exam_name", "CLAT").eq("exam_year", 2027).maybeSingle();
  if (data) redirect("/dashboard");
  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <section className="card w-full max-w-lg p-7 sm:p-10">
      <p className="text-sm font-semibold text-emerald-800">You&apos;re preparing for</p>
      <h1 className="mt-2 text-4xl font-semibold">CLAT UG 2027</h1>
      <p className="mt-3 text-slate-600">Set a simple starting goal. You can leave either field blank.</p>
      {error && <p role="alert" className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">We could not check your existing profile. You can retry below.</p>}
      <OnboardingForm />
    </section>
  </main>;
}
