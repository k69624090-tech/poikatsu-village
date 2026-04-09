"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
      }
    });
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="text-xs px-2.5 py-1 rounded-full bg-village-pink-100 text-village-pink-600 hover:bg-village-pink-200 transition-colors font-medium"
      title="管理者ダッシュボード"
    >
      🛡️ 管理
    </Link>
  );
}
