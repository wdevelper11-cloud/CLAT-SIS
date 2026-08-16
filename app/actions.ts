"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = value(form, "email");
  const password = value(form, "password");
  if (!emailPattern.test(email) || !password) return { error: "Enter a valid email and password." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email or password is incorrect." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session could not be started. Please try again." };
  const { data, error: profileError } = await supabase.from("exam_profiles").select("id").eq("user_id", user.id).eq("exam_name", "CLAT").eq("exam_year", 2027).maybeSingle();
  if (profileError) console.error("Unable to check exam profile", profileError.message);
  redirect(data ? "/dashboard" : "/onboarding");
}

export async function signup(_: FormState, form: FormData): Promise<FormState> {
  const fullName = value(form, "fullName");
  const email = value(form, "email");
  const password = value(form, "password");
  if (fullName.length < 2) return { error: "Enter your full name." };
  if (!emailPattern.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      ...(origin ? { emailRedirectTo: `${origin}/auth/callback` } : {}),
    },
  });
  if (error) return { error: error.message };
  if (data.session) redirect("/onboarding");
  return { success: "Account created. Check your email to confirm your address, then log in." };
}

export async function onboard(_: FormState, form: FormData): Promise<FormState> {
  const targetRaw = value(form, "targetScore");
  const minutesRaw = value(form, "dailyStudyMinutes");
  const target = targetRaw ? Number(targetRaw) : null;
  const minutes = minutesRaw ? Number(minutesRaw) : null;
  if (target !== null && (!Number.isFinite(target) || target <= 0 || target > 9999.99)) return { error: "Enter a valid positive target score." };
  if (minutes !== null && (!Number.isInteger(minutes) || minutes <= 0)) return { error: "Daily study time must be a positive whole number." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: existing, error: checkError } = await supabase.from("exam_profiles").select("id").eq("user_id", user.id).eq("exam_name", "CLAT").eq("exam_year", 2027).maybeSingle();
  if (checkError) {
    console.error("Unable to check onboarding state", checkError.message);
    return { error: "We could not check your profile. Please try again." };
  }
  if (existing) redirect("/dashboard");
  const { error } = await supabase.from("exam_profiles").insert({ user_id: user.id, exam_name: "CLAT", exam_level: "UG", exam_year: 2027, target_score: target, daily_study_minutes: minutes });
  if (error) {
    if (error.code === "23505") redirect("/dashboard");
    console.error("Unable to create exam profile", error.message);
    return { error: "We could not save your CLAT profile. Please try again." };
  }
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
