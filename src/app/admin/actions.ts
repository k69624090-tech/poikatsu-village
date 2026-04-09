"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// 管理者チェック（失敗時はトップへリダイレクト）
async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }
}

// 通報を却下
export async function dismissReport(formData: FormData) {
  await checkAdmin();
  const reportId = formData.get("reportId") as string;

  const service = createServiceClient();
  await service
    .from("reports")
    .update({ status: "dismissed" })
    .eq("id", reportId);
  revalidatePath("/admin");
}

// 通報対象コンテンツを削除し、通報をresolvedにする
export async function deleteContent(formData: FormData) {
  await checkAdmin();
  const reportId = formData.get("reportId") as string;
  const targetType = formData.get("targetType") as string;
  const targetId = formData.get("targetId") as string;

  const tableMap: Record<string, string> = {
    post: "posts",
    review: "reviews",
    comment: "comments",
    review_comment: "review_comments",
  };
  const table = tableMap[targetType];

  const service = createServiceClient();
  if (table) {
    await service.from(table).delete().eq("id", targetId);
  }
  await service
    .from("reports")
    .update({ status: "resolved" })
    .eq("id", reportId);
  revalidatePath("/admin");
}

// 全投稿・全レビュー管理タブからの直接削除
export async function deleteContentDirect(formData: FormData) {
  await checkAdmin();
  const targetType = formData.get("targetType") as string;
  const targetId = formData.get("targetId") as string;

  const table = targetType === "post" ? "posts" : "reviews";
  const service = createServiceClient();
  await service.from(table).delete().eq("id", targetId);
  revalidatePath("/admin");
}
