"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthStatus() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-gray-400 hidden sm:inline truncate max-w-[120px]">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs bg-village-pink-50 text-village-pink-500 hover:bg-village-pink-100 border border-village-pink-200 rounded-full px-3 py-1.5 transition-colors duration-200"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="btn-primary text-sm rounded-full px-5 py-1.5 font-medium"
    >
      ログイン
    </Link>
  );
}
