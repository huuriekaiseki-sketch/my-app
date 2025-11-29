"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase-client";

type AuthState =
  | { status: "loading"; userId: null }
  | { status: "guest"; userId: null }
  | { status: "authed"; userId: string };

export function useAuthUser(): AuthState {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    userId: null,
  });

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setState({ status: "guest", userId: null });
      } else {
        setState({ status: "authed", userId: data.user.id });
      }
    };

    load();
  }, []);

  return state;
}
