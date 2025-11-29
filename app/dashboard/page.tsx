"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase"; // ここが今ある supabase.ts

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      setEmail(data.user?.email ?? null);
    };

    loadUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">
        Logged in as: {email ?? "Not logged in"}
      </p>
    </div>
  );
}
