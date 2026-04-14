"use client";

import { useState } from "react";
import { createClient } from "@/util/supabase/client";
import ColorPicker from "./ColorPicker";
import PaletteGenerator from "./PaletteGenerator";
import { generatePalette } from "@/lib/generatePalette";
import TagInput from "./TagInput";
import { Color, Group, Tag } from "@/types/color";

type Props = {
  color: Color;
  groups: Group[];
  tags: Tag[];
  onClose: () => void;
  onUpdated: () => void;
  projectId: string | null;
  deleteColor: (id: string) => void;
};

export default function EditColorModal({
  color,
  groups,
  tags,
  onClose,
  onUpdated,
  projectId,
  deleteColor,
}: Props) {
  const [name, setName] = useState(color.name || "");
  const [hex, setHex] = useState(color.hex || "#ffffff");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    color.color_tags?.map((ct: any) => ct.tags.name) || [],
  );
  const [groupId, setGroupId] = useState<string>(color.group_id || "");
  const [generatedColors, setGeneratedColors] = useState<any[]>([]);
  const supabase = createClient();
  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const updateColor = async () => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // 色更新
    await supabase
      .from("colors")
      .update({
        name,
        hex,
        r,
        g,
        b,
        project_id: projectId || null,
        group_id: groupId || null,
      })
      .eq("id", color.id);

    // タグ更新（全削除 → 再登録）
    await supabase.from("color_tags").delete().eq("color_id", color.id);

    await supabase.from("color_tags").insert(
      selectedTags.map((tag_id) => ({
        color_id: color.id,
        tag_id,
      })),
    );

    onUpdated();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-bold mb-4">色を編集</h2>

        <input
          className="w-full border p-2 rounded mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <ColorPicker value={hex} onChange={setHex} />
        <button
          onClick={() => {
            const palette = generatePalette(hex);
            setGeneratedColors(palette);
          }}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded mb-2"
        >
          類似色を生成
        </button>
        <div>
          {generatedColors.map((color, index) => (
            <div key={color.name} className="flex items-center gap-2 mb-2">
              <div
                className="rounded-full w-6 h-6"
                style={{ backgroundColor: color.hex }}
              ></div>
              <span className="text-xs">{color.name}</span>
            </div>
          ))}
        </div>
        <PaletteGenerator baseHex={hex} />
        {/* コピー */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigator.clipboard.writeText(hex)}
            className="text-sm px-2 py-1 border rounded"
          >
            HEXコピー
          </button>

          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`,
              )
            }
            className="text-sm px-2 py-1 border rounded"
          >
            RGBコピー
          </button>
        </div>
        <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="">グループなし</option>
          {groups.map((group: any) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        {/* タグ */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: any) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTags.includes(tag.name) ? "bg-black text-white" : ""
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>閉じる</button>
          <button
            onClick={updateColor}
            className="bg-black text-white px-4 py-2 rounded"
          >
            保存
          </button>
          <button
            onClick={() => deleteColor(color.id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
