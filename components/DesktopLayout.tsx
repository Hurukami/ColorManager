"use client";

import SortableColorList from "./SortableColorList";

export default function DesktopLayout({
  projects,
  currentProjectId,
  setCurrentProjectId,
  groups,
  currentGroupId,
  setCurrentGroupId,
  colors,
  setColors,
  setEditingColor,
  saveOrder,
  setOpen,
}: any) {
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
      </aside>
      {/* メイン */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">🎨 Colors</h1>

          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + 色追加
          </button>
        </div>

        <SortableColorList
          colors={colors}
          setColors={setColors}
          onEdit={setEditingColor}
          onSave={saveOrder}
        />
      </main>
    </div>
  );
}
