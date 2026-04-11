'use client'

import { useState } from 'react'

export default function TagInput({
  tags,
  selectedTags,
  setSelectedTags
}: any) {
  const [input, setInput] = useState('')

  const addTag = (tag: any) => {
    if (!selectedTags.find((t: any) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const createTag = () => {
    if (!input.trim()) return

    const newTag = {
      id: 'new-' + input,
      name: input,
      isNew: true
    }

    setSelectedTags([...selectedTags, newTag])
    setInput('')
  }

  return (
    <div>
      {/* 選択済みタグ */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag: any) => (
          <span
            key={tag.id}
            className="px-2 py-1 bg-black text-white rounded-full text-sm"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* 入力 */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            createTag()
          }
        }}
        placeholder="タグを入力してEnter"
        className="w-full border p-2 rounded"
      />

      {/* サジェスト */}
      <div className="flex flex-wrap gap-2 mt-2">
        {tags
          .filter((t: any) =>
            t.name.toLowerCase().includes(input.toLowerCase())
          )
          .map((tag: any) => (
            <button
              key={tag.id}
              onClick={() => addTag(tag)}
              className="px-2 py-1 border rounded text-sm"
            >
              {tag.name}
            </button>
          ))}
      </div>
    </div>
  )
}