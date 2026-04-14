"use client";

import { Color } from "@/types/color";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  color,
  onEdit,
}: {
  color: Color;
  onEdit: (color: Color) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: color.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color.hex!,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.03 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-10 rounded-2xl shadow mb-2 cursor-move text-white"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing text-white bg-black/40 px-2 py-1 rounded opacity-70 hover:opacity-100"
      >
        ☰
      </div>
      {/*コピーアイコン*/}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(color.hex || "");
        }}
        className="top-2 right-2 group-hover:opacity-100 text-white text-xs bg-black/40 px-2 py-1 rounded"
      >
        HEXコピー
      </button>
      <div onClick={() => onEdit(color)} className="cursor-pointer">
        <div className="font-semibold text-white">{color.name || "無名"}</div>
        <div className="text-xs text-white opacity-80">{color.hex}</div>
        {/* タグ */}
        <div className="flex flex-wrap gap-1">
          {color.color_tags?.map((ct: any) => (
            <span
              key={ct.tags.id}
              className="text-xs px-2 py-0.5 rounded-full bg-black/30 text-white"
            >
              {ct.tags.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SortableColorList({
  colors,
  setColors,
  onEdit,
  onSave,
}: {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
  onEdit: (color: Color) => void;
  onSave: (newColors: Color[]) => void;
}) {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = colors.findIndex((c: Color) => c.id === active.id);
      const newIndex = colors.findIndex((c: Color) => c.id === over.id);
      const newColors = arrayMove(colors, oldIndex, newIndex);
      setColors(newColors);
      onSave(newColors);
    }
  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={colors.map((color: Color) => color.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-4 gap-4">
          {colors.map((color: Color) => (
            <SortableItem key={color.id} color={color} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
