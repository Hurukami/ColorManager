"use client";
import { useState } from "react";
import { createClient } from "@/util/supabase/client";
import TagInput from "./TagInput";
import ColorPicker from "./ColorPicker";
import { generatePalette } from "@/lib/generatePalette";
import PaletteGenerator from "./PaletteGenerator";
import { Color, Group, Tag } from "@/types/color";
import ColorForm from "./ColorForm";

type Props = {
  open: boolean;
  onClose: () => void;
  tags: Tag[];
  groups: Group[];
  projectId: string | null;
  initialColor: Color | null;
  onSubmit: () => void;
  colorDelete?: (id: string) => void;
};

export default function ColorModal({ open, onClose, ...props }: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {props.initialColor ? "色編集" : "色追加"}
        </h2>
        <ColorForm {...props} />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
