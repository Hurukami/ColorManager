"use client";

import BottomSheet from "./BottomSheet";
import ColorForm from "./ColorForm";
import { Group, Tag, Color } from "@/types/color";

type Props = {
  open: boolean;
  onClose: () => void;
  tags: Tag[];
  groups: Group[];
  projectId: string | null;
  initialColor?: Color | null;
  onSubmit: () => void;
};

export default function ColorBottomSheet({ open, onClose, ...props }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">
        {props.initialColor ? "色編集" : "色追加"}
      </h2>

      <ColorForm {...props} />
    </BottomSheet>
  );
}
