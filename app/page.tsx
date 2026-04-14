"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/util/supabase/client";
import DesktopLayout from "@/components/DesktopLayout";
import MobileLayout from "@/components/MobileLayout";
import { Color, Group, Project, Tag } from "@/types/color";

export default function Home() {
  // プロジェクト関連の状態
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  // カラー関連の状態
  const [colors, setColors] = useState<Color[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // グループ関連の状態
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [currentProjectId]);

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
    const { data } = await supabase
      .from("tags")
      .select("*")
      .eq("project_id", currentProjectId);
    setTags(data || []);
  };
  const fetchColors = async (tagId?: string) => {
    let query = supabase
      .from("colors")
      .select(
        `
      *,
      color_tags (
        tags (*)
      )
    `,
      )
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
  };

  const handleFilter = (tagId: string | null) => {
    setSelectedTag(tagId);
    fetchColors(tagId || undefined);
  };

  const fetchGroups = async () => {
    const { data } = await supabase
      .from("color_groups")
      .select("*")
      .eq("project_id", currentProjectId);
    setGroups(data || []);
    if (data?.length) setCurrentGroupId(data[0].id);
  };

  const createGroup = async (name: string) => {
    const { data } = await supabase
      .from("color_groups")
      .insert([{ name, project_id: currentProjectId }])
      .select()
      .single();

    if (data) {
      setGroups((prev) => [...prev, data]);
      setCurrentGroupId(data.id);
    }
  };

  const saveOrder = async (newColors: Color[]) => {
    const updates = newColors.map((color, index) => ({
      id: color.id,
      order: index,
    }));

    for (const u of updates) {
      await supabase.from("colors").update({ order: u.order }).eq("id", u.id);
    }
  };
  return (
    <div>
      <div className="hidden md:block">
        <DesktopLayout
          projects={projects}
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
          createProject={createProject}
          groups={groups}
          currentGroupId={currentGroupId}
          setCurrentGroupId={setCurrentGroupId}
          createGroup={createGroup}
          colors={colors}
          setColors={setColors}
          saveOrder={saveOrder}
          fetchColors={fetchColors}
          tags={tags}
          selectedTag={selectedTag}
          handleFilter={handleFilter}
          deleteColor={deleteColor}
        ></DesktopLayout>
      </div>
      <div className="block md:hidden">
        <MobileLayout
          projects={projects}
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
          createProject={createProject}
          groups={groups}
          currentGroupId={currentGroupId}
          setCurrentGroupId={setCurrentGroupId}
          createGroup={createGroup}
          colors={colors}
          setColors={setColors}
          saveOrder={saveOrder}
          fetchColors={fetchColors}
          tags={tags}
          selectedTag={selectedTag}
          handleFilter={handleFilter}
          deleteColor={deleteColor}
        ></MobileLayout>
      </div>
    </div>
  );
}
