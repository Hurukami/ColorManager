"use client";

import { useState } from "react";

export default function GroupSidebar({
  groups,
  currentGroupId,
  onSelectGroup,
  onCreateGroup,
}: any) {
  const [newGroupName, setNewGroupName] = useState("");
  return (
    <div className="w-full md:w-48 flex md:block overflow-x-auto">
      <h3 className="text-lg font-bold mb-4">Groups</h3>
      {groups.map((group: any) => (
        <div
          key={group.id}
          className={`p-2 rounded cursor-pointer ${
            group.id === currentGroupId
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => onSelectGroup(group.id)}
        >
          {group.name}
        </div>
      ))}
      <div className="mt-4">
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="新規グループ"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={() => {
            onCreateGroup(newGroupName);
            setNewGroupName("");
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
