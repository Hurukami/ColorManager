"use client";

import { useState } from "react";

export default function ProjectSidebar({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
}: any) {
  const [newProjectName, setNewProjectName] = useState("");

  return (
    <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <div className="flex-1 overflow-y-auto">
        {projects.map((project: any) => (
          <div
            key={project.id}
            className={`p-2 rounded ${project.id === currentProjectId ? "bg-blue-500 text-white" : "hover:bg-gray-200"} cursor-pointer`}
            onClick={() => onSelectProject(project.id)}
          >
            {project.name}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="新規プロジェクト"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={() => {
            onCreateProject(newProjectName);
            setNewProjectName("");
          }}
        >
          追加
        </button>
      </div>
    </div>
  );
}
