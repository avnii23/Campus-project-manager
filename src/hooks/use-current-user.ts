import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  major: string | null;
  headline: string | null;
  bio: string | null;
};

/**
 * Loads the signed-in Supabase user + their `profiles` row.
 * Consumers should render loading and empty fallbacks.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      return { user, profile: (profile ?? null) as Profile | null };
    },
    staleTime: 60_000,
  });
}
