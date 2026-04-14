export type Tag = {
  id: string;
  name: string;
  color?: string;
  isNew?: boolean; // 新規タグかどうかのフラグ（UI用）
};

export type Color = {
  id: string;
  name: string | null;
  hex: string | null;
  r: number;
  g: number;
  b: number;
  group_id?: string;
  color_tags: {
    tag: Tag;
  }[];
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: string;
  project_id: string;
  name: string;
  sort_order: number;
};
