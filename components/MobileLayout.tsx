"use client";

import { useDeleteProject } from "@/hooks/useDeleteProject";
import { Color, Group, Project, Tag } from "@/types/color";
import SortableColorList from "./SortableColorList";
import { useState } from "react";
import BottomSheet from "./BottomSheet";
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
  onProjectDeleted: (projectId: string) => void;
  onGroupDeleted: (groupId: string) => void;
};

export default function MobileLayout({
  projects,
  currentProjectId,
  setCurrentProjectId,
  createProject,
  groups,
  currentGroupId,
  setCurrentGroupId,
  colors,
  setColors,
  saveOrder,
  fetchColors,
  tags,
  selectedTag,
  deleteColor,
  onProjectDeleted,
  onGroupDeleted,
}: Props) {
  const { deleteProject } = useDeleteProject();
  const [open, setOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [projectSheetOpen, setProjectSheetOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const currentProject =
    projects.find((project) => project.id === currentProjectId) ?? null;

  const editColor = (color: Color) => {
    setEditingColor(color);
    setOpen(true);
  };

  const handleProjectDelete = async (project: Project) => {
    const confirmed = window.confirm(
      `「${project.name}」を削除します。関連する色・タグ・グループも削除されます。`,
    );

    if (!confirmed) {
      return;
    }

    const deleted = await deleteProject(project.id);

    if (!deleted) {
      return;
    }

    setProjectSheetOpen(false);
    onProjectDeleted(project.id);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header className="p-4 bg-white shadow-sm flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Project
          </p>
          <button
            type="button"
            onClick={() => setProjectSheetOpen(true)}
            className="mt-1 max-w-[220px] truncate rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-800"
          >
            {currentProject?.name ?? "プロジェクトを選択"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setProjectSheetOpen(true)}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
        >
          管理
        </button>
      </header>

      {/* グループ横スクロール */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-white border-b">
        {groups.map((g) => (
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
      <BottomSheet
        open={projectSheetOpen}
        onClose={() => setProjectSheetOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              プロジェクト一覧
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              切り替えと削除をここでまとめて操作できます。
            </p>
          </div>

          <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
            {projects.map((project) => {
              const isActive = project.id === currentProjectId;

              return (
                <div
                  key={project.id}
                  className={`rounded-2xl border p-3 ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentProjectId(project.id);
                        setProjectSheetOpen(false);
                      }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-base font-semibold">
                        {project.name}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          isActive ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {isActive ? "現在表示中" : "タップで切り替え"}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void handleProjectDelete(project);
                      }}
                      className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-gray-50 p-3">
            <label className="text-sm font-semibold text-gray-700">
              新しいプロジェクト
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                placeholder="プロジェクト名"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <button
                type="button"
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  createProject(newProjectName);
                  setNewProjectName("");
                  setProjectSheetOpen(false);
                }}
              >
                追加
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
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
