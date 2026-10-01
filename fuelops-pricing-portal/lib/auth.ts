import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const getAuthContext = cache(async () => {
  const supabase = createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub as string | undefined;
  if (claimsError || !userId) redirect('/login');
  const { data: profile, error } = await supabase.from('profiles').select('id,email,full_name,role,portal_role,title,avatar_url,created_at').eq('id', userId).single();
  if (error || !profile) redirect('/login');
  return { supabase, profile: profile as Profile };
});
