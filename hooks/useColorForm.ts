"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/util/supabase/client";
import { Color, Tag } from "@/types/color";

export function useColorForm(
  initialColor: Color | null,
  projectId: string | null,
  onSubmit: () => void,
) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [hex, setHex] = useState("#ff0000");
  const [groupId, setGroupId] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [generatedColors, setGeneratedColors] = useState<
    { name: string; hex: string }[]
  >([]);

  // ⭐ 初期値同期（超重要）
  useEffect(() => {
    if (initialColor) {
      setName(initialColor.name || "");
      setHex(initialColor.hex || "#ff0000");
      setGroupId(initialColor.group_id || "");
      setSelectedTags(initialColor.color_tags?.map((ct) => ct.tags) || []);
    } else {
      setName("");
      setHex("#ff0000");
      setGroupId("");
      setSelectedTags([]);
      setGeneratedColors([]);
    }
  }, [initialColor]);

  const handleTags = async () => {
    const tagIds: string[] = [];

    for (const tag of selectedTags) {
      if (tag.isNew) {
        const { data } = await supabase
          .from("tags")
          .insert([{ name: tag.name, project_id: projectId }])
          .select()
          .single();

        if (data) tagIds.push(data.id);
      } else {
        tagIds.push(tag.id);
      }
    }

    return tagIds;
  };

  const save = async () => {
    const tagIds = await handleTags();

    const insertOne = async (hexValue: string) => {
      const r = parseInt(hexValue.slice(1, 3), 16);
      const g = parseInt(hexValue.slice(3, 5), 16);
      const b = parseInt(hexValue.slice(5, 7), 16);

      const { data } = await supabase
        .from("colors")
        .insert({
          name,
          hex: hexValue,
          r,
          g,
          b,
          project_id: projectId || null,
          group_id: groupId || null,
        })
        .select()
        .single();

      if (!data) return;

      await supabase.from("color_tags").insert(
        tagIds.map((tag_id) => ({
          color_id: data.id,
          tag_id,
        })),
      );
    };

    if (generatedColors.length > 0) {
      for (const c of generatedColors) {
        await insertOne(c.hex);
      }
    } else {
      await insertOne(hex);
    }

    onSubmit();
  };

  return {
    name,
    setName,
    hex,
    setHex,
    groupId,
    setGroupId,
    selectedTags,
    setSelectedTags,
    generatedColors,
    setGeneratedColors,
    save,
  };
}
