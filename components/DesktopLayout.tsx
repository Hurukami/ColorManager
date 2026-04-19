"use client";

import { useRef, useState } from "react";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import SortableColorList from "./SortableColorList";
import { Color, Group, Project, Tag } from "@/types/color";
import ColorModal from "./ColorModal";
import { useDeleteGroup } from "@/hooks/useDeleteGroup";

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

const PROJECT_SWIPE_WIDTH = 88;
const SWIPE_THRESHOLD = 12;

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
  onProjectDeleted,
  onGroupDeleted,
}: Props) {
  const { deleteProject } = useDeleteProject();
  const { deleteGroup } = useDeleteGroup();
  const [open, setOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [swipedProjectId, setSwipedProjectId] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(
    null,
  );
  const [swipedGroupId, setSwipedGroupId] = useState<string | null>(null);
  const [draggingGroupId, setDraggingGroupId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOriginOffset, setDragOriginOffset] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const swipeGestureRef = useRef(false);

  const editColor = (color: Color) => {
    setEditingColor(color);
    setOpen(true);
  };

  const getProjectOffset = (projectId: string) => {
    if (draggingProjectId === projectId) {
      return dragOffset;
    }

    return swipedProjectId === projectId ? PROJECT_SWIPE_WIDTH : 0;
  };

  const finishProjectSwipe = (projectId: string) => {
    if (draggingProjectId !== projectId) {
      return;
    }

    if (!swipeGestureRef.current) {
      setSwipedProjectId(null);
      setCurrentProjectId(projectId);
    } else {
      setSwipedProjectId(
        dragOffset > PROJECT_SWIPE_WIDTH / 2 ? projectId : null,
      );
    }

    setDraggingProjectId(null);
    setDragStartX(0);
    setDragOriginOffset(0);
    setDragOffset(0);
  };

  const getGroupOffset = (groupId: string) => {
    if (draggingGroupId === groupId) {
      return dragOffset;
    }
    return swipedGroupId === groupId ? PROJECT_SWIPE_WIDTH : 0;
  };

  const finishGroupSwipe = (groupId: string) => {
    if (draggingGroupId !== groupId) {
      return;
    }
    if (!swipeGestureRef.current) {
      setSwipedGroupId(null);
      setCurrentGroupId(groupId);
    } else {
      setSwipedGroupId(dragOffset > PROJECT_SWIPE_WIDTH / 2 ? groupId : null);
    }

    setDraggingGroupId(null);
    setDragStartX(0);
    setDragOriginOffset(0);
    setDragOffset(0);
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

    setSwipedProjectId(null);
    onProjectDeleted(project.id);
  };

  const handleGroupDelete = async (group: Group) => {
    const confirmed = window.confirm(
      `「${group.name}」を削除します。関連する色・タグも削除されます。`,
    );

    if (!confirmed) {
      return;
    }

    const deleted = await deleteGroup(group.id);

    if (!deleted) {
      return;
    }

    setSwipedGroupId(null);
    onGroupDeleted(group.id);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4 bg-gray-50 overflow-auto">
        <h2 className="font-bold mb-2">Projects</h2>
        <p className="mb-3 text-xs text-gray-500">
          右へスワイプすると削除できます
        </p>
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-xl"
              onPointerDown={(e) => {
                setSwipedProjectId((current) =>
                  current === project.id ? current : null,
                );
                setDraggingProjectId(project.id);
                setDragStartX(e.clientX);

                const initialOffset =
                  swipedProjectId === project.id ? PROJECT_SWIPE_WIDTH : 0;

                setDragOriginOffset(initialOffset);
                setDragOffset(initialOffset);
                swipeGestureRef.current = false;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (draggingProjectId !== project.id) {
                  return;
                }

                const nextOffset = Math.max(
                  0,
                  Math.min(
                    PROJECT_SWIPE_WIDTH,
                    dragOriginOffset + (e.clientX - dragStartX),
                  ),
                );

                if (Math.abs(nextOffset - dragOriginOffset) > SWIPE_THRESHOLD) {
                  swipeGestureRef.current = true;
                }

                setDragOffset(nextOffset);
              }}
              onPointerUp={() => finishProjectSwipe(project.id)}
              onPointerCancel={() => finishProjectSwipe(project.id)}
              style={{ touchAction: "pan-y" }}
            >
              <div className="absolute inset-y-0 left-0 flex items-stretch">
                <button
                  type="button"
                  className="w-[88px] bg-red-500 text-sm font-semibold text-white"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleProjectDelete(project);
                  }}
                >
                  削除
                </button>
              </div>

              <button
                type="button"
                className={`relative w-full rounded-xl border px-3 py-3 text-left transition-transform ${
                  project.id === currentProjectId
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 bg-white hover:bg-gray-100"
                }`}
                style={{
                  transform: `translateX(${getProjectOffset(project.id)}px)`,
                }}
              >
                {project.name}
              </button>
            </div>
          ))}
        </div>
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
        {groups.map((group) => (
          <div
            key={group.id}
            className="relative overflow-hidden rounded-xl mb-2"
            onPointerDown={(e) => {
              setSwipedGroupId((current) =>
                current === group.id ? current : null,
              );
              setDraggingGroupId(group.id);
              setDragStartX(e.clientX);

              const initialOffset =
                swipedGroupId === group.id ? PROJECT_SWIPE_WIDTH : 0;

              setDragOriginOffset(initialOffset);
              setDragOffset(initialOffset);
              swipeGestureRef.current = false;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (draggingGroupId !== group.id) {
                return;
              }

              const nextOffset = Math.max(
                0,
                Math.min(
                  projects.length * PROJECT_SWIPE_WIDTH,
                  dragOriginOffset + (e.clientX - dragStartX),
                ),
              );

              if (Math.abs(nextOffset - dragOriginOffset) > SWIPE_THRESHOLD) {
                swipeGestureRef.current = true;
              }
              setDragOffset(nextOffset);
            }}
            onPointerUp={() => finishGroupSwipe(group.id)}
            onPointerCancel={() => finishGroupSwipe(group.id)}
            style={{ touchAction: "pan-y" }}
          >
            <div className="absolute inset-y-0 left-0 flex items-stretch">
              <button
                type="button"
                className="w-[88px] bg-red-500 text-sm font-semibold text-white"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleGroupDelete(group);
                }}
              >
                削除
              </button>
            </div>
            <button
              type="button"
              className={`relative w-full rounded-xl border px-3 py-3 text-left transition-transform ${
                group.id === currentGroupId
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white hover:bg-gray-100"
              }`}
              style={{
                transform: `translateX(${getGroupOffset(group.id)}px)`,
              }}
            >
              {group.name}
            </button>
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
          {tags.map((tag) => (
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
        colorDelete={deleteColor}
      />
    </div>
  );
}
