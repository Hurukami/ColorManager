"use client";

import { useState } from "react";
import SortableColorList from "./SortableColorList";
import EditColorModal from "./EditColorModal";
import { Color, Group, Project, Tag } from "@/types/color";
import ColorModal from "./AddColorModal";

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

export default function DesktopLayout({
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
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4 bg-gray-50 overflow-auto">
        <h2 className="font-bold mb-2">Projects</h2>
        {projects.map((project: any) => (
          <div
            key={project.id}
            onClick={() => setCurrentProjectId(project.id)}
            className={`
                            p-2 rounded cursor-pointer
                            ${project.id === currentProjectId ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
                        `}
          >
            {project.name}
          </div>
        ))}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="新規プロジェクト名"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={() => {
              createProject(newProjectName);
              setNewProjectName("");
            }}
          >
            + プロジェクト
          </button>
        </div>
      </aside>

      <aside className="w-48 border-r p-4 bg-gray-50 overflow-auto">
        <h2 className="font-bold mb-2">Groups</h2>
        {groups.map((group: any) => (
          <div
            key={group.id}
            onClick={() => setCurrentGroupId(group.id)}
            className={`
                            p-2 rounded cursor-pointer
                            ${group.id === currentGroupId ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
                        `}
          >
            {group.name}
          </div>
        ))}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="新規グループ名"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={() => {
              createGroup(newGroupName);
              setNewGroupName("");
            }}
          >
            + グループ
          </button>
        </div>
      </aside>
      {/* メイン */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">🎨 Colors</h1>

          <button
            onClick={() => {
              setEditingColor(null);
              setOpen(true);
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + 色追加
          </button>
        </div>
        {/* タグフィルタ */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleFilter(null)}
            className={`p-2 rounded cursor-pointer ${selectedTag === null ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            すべて
          </button>
          {tags.map((tag: any) => (
            <button
              key={tag.id}
              onClick={() => handleFilter(tag.id)}
              className={`p-2 rounded cursor-pointer ${selectedTag === tag.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <SortableColorList
          colors={colors}
          setColors={setColors}
          onEdit={editColor}
          onSave={saveOrder}
        />
      </main>
      <ColorModal
        open={open}
        onClose={() => setOpen(false)}
        tags={tags}
        groups={groups}
        onSubmit={() => {
          fetchColors(selectedTag || undefined);
          setOpen(false);
        }}
        initialColor={editingColor}
        projectId={currentProjectId}
      />
    </div>
  );
}
