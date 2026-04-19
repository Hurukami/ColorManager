"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/util/supabase/client";
import TagInput from "./TagInput";
import ColorPicker from "./ColorPicker";
import { generatePalette } from "@/lib/generatePalette";
import PaletteGenerator from "./PaletteGenerator";
import { Color, Group, Tag } from "@/types/color";
import GroupSelectSection from "./GroupSelectSection";
import PaletteSection from "./PaletteSection";
import { useColorForm } from "@/hooks/useColorForm";

type Props = {
  tags: Tag[];
  groups: Group[];
  projectId: string | null;
  initialColor: Color | null;
  onSubmit: () => void;
  colorDelete?: (id: string) => void;
};

export default function ColorForm({
  tags,
  groups,
  projectId,
  initialColor,
  onSubmit,
  colorDelete,
}: Props) {
  const {
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
  } = useColorForm(initialColor, projectId, onSubmit);

  return (
    <div className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ColorPicker value={hex} onChange={setHex} />
      <details>
        <summary>グループを選択</summary>
        <GroupSelectSection
          groups={groups}
          groupId={groupId}
          setGroupId={setGroupId}
        />
      </details>
      <details>
        <summary>タグを選択</summary>
        <TagInput
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </details>
      <details>
        <summary>パレットを生成</summary>

        <PaletteGenerator
          baseHex={hex}
          generatedColors={generatedColors}
          setGeneratedColors={setGeneratedColors}
        />
      </details>

      <button
        onClick={save}
        className="w-full bg-black text-white py-3 rounded"
      >
        保存
      </button>

      <button
        className="w-full bg-red-500 text-white py-3 rounded"
        onClick={() => {
          colorDelete && initialColor && colorDelete(initialColor.id);
        }}
      >
        削除
      </button>
    </div>
  );
}
