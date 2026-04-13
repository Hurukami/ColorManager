"use client";

import SortableColorList from "./SortableColorList";

export default function MobileLayout({
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
          onEdit={setEditingColor}
          onSave={saveOrder}
        />
      </main>

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
