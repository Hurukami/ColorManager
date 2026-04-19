"use client";

import { createClient } from "@/util/supabase/client";

export function useDeleteGroup() {
  const supabase = createClient();

  const deleteGroup = async (groupId: string) => {
    // ① colors取得
    const { data: colors } = await supabase
      .from("colors")
      .select("id")
      .eq("group_id", groupId);

    const colorIds = colors?.map((c) => c.id) || [];

    // ② color_tags削除
    if (colorIds.length > 0) {
      await supabase.from("color_tags").delete().in("color_id", colorIds);
    }

    // ③ colors削除
    await supabase.from("colors").delete().eq("group_id", groupId);

    // ⑥ group削除
    const { error } = await supabase
      .from("color_groups")
      .delete()
      .eq("id", groupId);

    if (error) {
      console.error("グループ削除失敗", error);
      return false;
    }

    return true;
  };

  return { deleteGroup };
}
