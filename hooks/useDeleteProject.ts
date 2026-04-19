"use client";

import { createClient } from "@/util/supabase/client";

export function useDeleteProject() {
  const supabase = createClient();

  const deleteProject = async (projectId: string) => {
    // ① colors取得
    const { data: colors } = await supabase
      .from("colors")
      .select("id")
      .eq("project_id", projectId);

    const colorIds = colors?.map((c) => c.id) || [];

    // ② color_tags削除
    if (colorIds.length > 0) {
      await supabase.from("color_tags").delete().in("color_id", colorIds);
    }

    // ③ colors削除
    await supabase.from("colors").delete().eq("project_id", projectId);

    // ④ color_groups削除
    await supabase.from("color_groups").delete().eq("project_id", projectId);

    // ⑤ tags削除
    await supabase.from("tags").delete().eq("project_id", projectId);

    // ⑥ project削除
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("プロジェクト削除失敗", error);
      return false;
    }

    return true;
  };

  return { deleteProject };
}
