import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

function greeting() {
  const hour = new Date().getUTCHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [profileResult, examResult, subjectsResult] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("exam_profiles").select("exam_name, exam_level, exam_year").eq("user_id", user.id).eq("exam_name", "CLAT").eq("exam_year", 2027).maybeSingle(),
    supabase.from("subjects").select("id, name, display_order").eq("exam_name", "CLAT").eq("is_active", true).order("display_order"),
  ]);
  if (!examResult.data && !examResult.error) redirect("/onboarding");
  if (profileResult.error) console.error("Unable to load profile", profileResult.error.message);
  if (examResult.error) console.error("Unable to load exam profile", examResult.error.message);
  if (subjectsResult.error) console.error("Unable to load subjects", subjectsResult.error.message);
  const name = profileResult.data?.full_name?.trim() || user.email?.split("@")[0] || "Student";
  const exam = examResult.data;

  return <AppShell><main className="py-9 sm:py-12">
    <div><h1 className="text-3xl font-semibold">{greeting()}, {name}</h1><p className="mt-2 text-slate-600">{exam ? `${exam.exam_name} ${exam.exam_level} ${exam.exam_year}` : "Your CLAT profile is temporarily unavailable"}</p></div>
    {(profileResult.error || examResult.error || subjectsResult.error) && <p role="alert" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Some information could not be loaded. Please refresh to try again.</p>}
    <div className="mt-9 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="card p-7 sm:p-9"><p className="text-sm font-semibold text-emerald-800">Student Intelligence</p><h2 className="mt-5 text-2xl font-semibold">Not enough data yet.</h2><p className="mt-3 max-w-lg leading-7 text-slate-600">Complete your first diagnostic or mock<br className="hidden sm:block" /> to allow SIS to begin learning about<br className="hidden sm:block" /> your preparation.</p></section>
      <section className="card p-7"><p className="text-sm font-semibold text-slate-600">CLAT Readiness</p><p className="mt-5 text-xl font-semibold">Not calculated yet</p></section>
    </div>
    <section className="mt-9"><h2 className="text-xl font-semibold">Subjects</h2>
      {subjectsResult.data?.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{subjectsResult.data.map((subject) => <article className="card p-5" key={subject.id}><h3 className="font-semibold">{subject.name}</h3><p className="mt-4 text-sm text-slate-500">No data</p></article>)}</div> : <div className="card mt-4 p-5 text-sm text-slate-600">Subject data is unavailable right now.</div>}
    </section>
  </main></AppShell>;
}
