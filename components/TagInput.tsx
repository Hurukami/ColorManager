"use client";

import { Tag } from "@/types/color";
import { useState } from "react";

type Props = {
  tags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[] | ((prev: Tag[]) => Tag[])) => void;
};

export default function TagInput({
  tags,
  selectedTags,
  setSelectedTags,
}: Props) {
  const [input, setInput] = useState("");
  const toggleTag = (name: string) => {
    setSelectedTags((prev: Tag[]) =>
      prev.some((t) => t.name === name)
        ? prev.filter((t) => t.name !== name)
        : [...prev, { id: "new-" + name, name }],
    );
  };
  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t: Tag) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const createTag = () => {
    if (!input.trim()) return;

    const newTag = {
      id: "new-" + input,
      name: input,
      isNew: true,
    };

    setSelectedTags([...selectedTags, newTag]);
    setInput("");
  };

  return (
    <div>
      {/* 入力 */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createTag();
          }
        }}
        placeholder="タグを入力してEnter"
        className="w-full border p-2 rounded"
      />

      {/* サジェスト */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag: Tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.name)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedTags.some((t) => t.name === tag.name)
                ? "bg-black text-white"
                : ""
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
