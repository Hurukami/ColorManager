"use client";

import { createClient } from "@/util/supabase/client";

export function useDeleteTag() {
  const supabase = createClient();

  const deleteTag = async (tagId: string) => {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);

    if (error) {
      console.error("タグ削除失敗", error);
      return false;
    }

    return true;
  };

  return { deleteTag };
}
