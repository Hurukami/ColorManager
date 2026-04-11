"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/util/supabase/client";
import ProjectSidebar from "@/components/ProjectSidebar";
import AddColorModal from "@/components/AddColorModal";
import EditColorModal from "@/components/EditColorModal";
import GroupSidebar from "@/components/GroupSidebar";
import SortableColorList from "@/components/SortableColorList";

export default function Home() {
  // プロジェクト関連の状態
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  // カラー関連の状態
  const [colors, setColors] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // グループ関連の状態
  const [groups, setGroups] = useState<any[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [currentProjectId])


  useEffect(() => {
    if (currentProjectId) {
      fetchTags();
      fetchColors();
    }
  }, [currentProjectId, currentGroupId]);

  // プロジェクト関連の関数
  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*");
    setProjects(data || []);
    if (data?.length && !currentProjectId) {
      setCurrentProjectId(data[0].id);
    }
  };

  const createProject = async (name: string) => {
    const { data } = await supabase
      .from("projects")
      .insert([{ name }])
      .select()
      .single();
    if (data) {
      setProjects((prev) => [...prev, data]);
      setCurrentProjectId(data.id);
    }
  };
  // カラー関連の関数
  const fetchTags = async () => {
    const { data } = await supabase.from("tags").select("*").eq("project_id", currentProjectId).order('sort_order', { ascending: true });
    setTags(data || []);
  };
  const fetchColors = async (tagId?: string) => {
    let query = supabase.from("colors").select(`
      *,
      color_tags (
        tags (*)
      )
    `)
    .eq("project_id", currentProjectId)
    .eq("group_id", currentGroupId);

    if (tagId) {
      query = query.eq("color_tags.tag_id", tagId);
    }

    const { data } = await query;
    setColors(data || []);
  };
  const deleteColor = async (id: string) => {
    await supabase.from("colors").delete().eq("id", id);
    fetchColors(selectedTag || undefined);
  }

  const handleFilter = (tagId: string | null) => {
    setSelectedTag(tagId);
    fetchColors(tagId || undefined);
  };

  const fetchGroups = async () => {
    const { data } = await supabase.from("color_groups").select("*").eq("project_id", currentProjectId);
    setGroups(data || []);
    if(data?.length) setCurrentGroupId(data[0].id);
  }
  
  const createGroup = async (name: string) => {
    const { data } = await supabase
      .from("color_groups")
      .insert([{ name, project_id: currentProjectId }])
      .select()
      .single();

      if(data){
        setGroups((prev) => [...prev, data]);
        setCurrentGroupId(data.id);
      }
  }

  const saveOrder = async(newColors: any[]) => {
    const updates = newColors.map((color, index) => ({
      id: color.id,
      order: index,
    }))

    for(const u of updates){
      await supabase.from("colors").update({ order: u.order }).eq("id", u.id);
    }
  }

  return (
    <div className="flex">
      {/* サイドバー */}
        <ProjectSidebar
          projects={projects}
          currentProjectId={currentProjectId}
          onCreateProject={createProject}
          onSelectProject={setCurrentProjectId}
        />
        <GroupSidebar
          groups={groups}
          currentGroupId={currentGroupId}
          onSelectGroup={setCurrentGroupId}
          onCreateGroup={createGroup}
        />

      <main className="p-6 max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🎨 カラーパレット</h1>
  
          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-xl shadow hover:opacity-80"
          >
            + 色を追加
          </button>
        </div>
        {/* タグフィルタ */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleFilter(null)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedTag === null ? "bg-black text-white" : ""
            }`}
          >
            すべて
          </button>

          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleFilter(tag.id)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTag === tag.id ? "ring-2 ring-black" : ""
              }`}
              style={{ backgroundColor: tag.color || "#eee" }}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <SortableColorList
          colors={colors}
          setColors={setColors}
          onEdit={setEditingColor}
          onSave={saveOrder}
          deleteColor={deleteColor}
        />
      </main>
      {/* モーダル */}
      {open && (
        <AddColorModal
          tags={tags}
          groups={groups}
          onClose={() => setOpen(false)}
          onAdded={() => {
            setOpen(false);
            fetchColors(selectedTag || undefined);
          }}
          projectId={currentProjectId}
        />
      )}
      {editingColor && (
        <EditColorModal
          color={editingColor}
          groups={groups}
          tags={tags}
          onClose={() => setEditingColor(null)}
          onUpdated={() => {
            setEditingColor(null);
            fetchColors(selectedTag || undefined);
          }}
          projectId={currentProjectId}
        />
      )}
    </div>
  );
}
