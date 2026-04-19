"use client";

import { Color, Group, Project, Tag } from "@/types/color";
import SortableColorList from "./SortableColorList";
import { useState } from "react";
import ColorBottomSheet from "./ColorBottomSheet";

type Props = {
  projects: Project[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  createProject: (name: string) => void;
  groups: Group[];
  currentGroupId: string | null;
  setCurrentGroupId: (id: string) => void;
  createGroup: (name: string) => void;
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
  saveOrder: (colors: Color[]) => void;
  fetchColors: (tagId?: string) => void;
  tags: Tag[];
  selectedTag: string | null;
  handleFilter: (tagId: string | null) => void;
  deleteColor: (id: string) => void;
};

export default function MobileLayout({
  projects,
  currentProjectId,
  setCurrentProjectId,
  createProject,
  groups,
  currentGroupId,
  setCurrentGroupId,
  createGroup,
  colors,
  setColors,
  saveOrder,
  fetchColors,
  tags,
  selectedTag,
  handleFilter,
  deleteColor,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const editColor = (color: Color) => {
    setEditingColor(color);
    setOpen(true);
  };
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="font-bold text-lg">🎨</h1>

        <select
          value={currentProjectId || ""}
          onChange={(e) => setCurrentProjectId(e.target.value)}
          className="border p-2 rounded"
        >
          {projects.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </header>

      {/* グループ横スクロール */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-white border-b">
        {groups.map((g: any) => (
          <button
            key={g.id}
            onClick={() => setCurrentGroupId(g.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              currentGroupId === g.id ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* メイン */}
      <main className="flex-1 overflow-auto p-3">
        <SortableColorList
          colors={colors}
          setColors={setColors}
          onEdit={editColor}
          onSave={saveOrder}
        />
      </main>
      <ColorBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        tags={tags}
        groups={groups}
        projectId={currentProjectId}
        onSubmit={() => {
          setOpen(false);
          fetchColors(selectedTag || undefined);
        }}
        initialColor={editingColor}
        colorDelete={deleteColor}
      ></ColorBottomSheet>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full text-2xl shadow-lg"
      >
        ＋
      </button>
    </div>
  );
}
