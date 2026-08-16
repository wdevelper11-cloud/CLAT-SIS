import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await supabase.from("exam_profiles").select("id").eq("user_id", user.id).eq("exam_name", "CLAT").eq("exam_year", 2027).maybeSingle();
  redirect(data ? "/dashboard" : "/onboarding");
}
