'use client'
import {useState} from 'react'
import { createClient} from '@/util/supabase/client'
import TagInput from './TagInput'
import ColorPicker from './ColorPicker'
import { generatePalette } from '@/lib/generatePalette'
import  PaletteGenerator  from './PaletteGenerator'

export default function AddColorModal({ tags, groups, onClose, onAdded, projectId }: any) {
  const [name, setName] = useState('')
  const [hex, setHex] = useState('#ff0000')
  const [selectedTags, setSelectedTags] = useState<any[]>([])
  const [groupId, setGroupId] = useState<string>('')
  const [generatedColors, setGeneratedColors] = useState<any[]>([])
  const supabase = createClient()

  const handleTags = async ()=>{
    const tagIds: string[] = []
    for(const tag of selectedTags){
      if(tag.isNew){
        // 新規タグは先に作成
        const { data: newTag } = await supabase
            .from('tags')
            .insert([{ name: tag.name, project_id: projectId }])
            .select()
            .single()
        if(newTag) tagIds.push(newTag.id)
      } else {
        tagIds.push(tag.id)
      }
    }
    return tagIds
  }

  const addColor = async () => {
    if (generatedColors.length > 0) {
      for (const color of generatedColors) {
        const { data } = await supabase.from('colors').insert({
          name: name,
          hex: color.hex,
          r: parseInt(color.hex.slice(1, 3), 16),
          g: parseInt(color.hex.slice(3, 5), 16),
          b: parseInt(color.hex.slice(5, 7), 16),
          project_id: projectId,
          group_id: groupId || null

        }).select().single()
        if (data) {
          const tagIds = await handleTags();
          tagIds.push(color.name)
          await supabase.from('color_tags').insert(
            tagIds.map(tag_id => ({
              color_id: data.id,
              tag_id
            }))
          )
        }
      }
    } else {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const { data } = await supabase
        .from("colors")
        .insert([
          {
            name,
            hex,
            r,
            g,
            b,
            project_id: projectId,
            group_id: groupId || null,
          },
        ])
        .select()
        .single();

      if (!data) return;
      const tagIds = await handleTags();
      await supabase.from("color_tags").insert(
        tagIds.map((tag_id) => ({
          color_id: data.id,
          tag_id,
        })),
      );
    }
    onAdded();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-bold mb-4">色を追加</h2>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="名前"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <ColorPicker value={hex} onChange={setHex} />


        <select
          value={groupId}
          onChange={(e)=> setGroupId(e.target.value)}
          className='w-full border p-2 rounded mb-2'
        >
          <option value="">グループなし</option>
          {
            groups.map((group: any) => (
              <option key={group.id} value={group.id}>
                {group.name}
                </option>
            ))
          }
        </select>
        <TagInput
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <button
          onClick={() => {
            const palette = generatePalette(hex)
            setGeneratedColors(palette)
          }}
          className='w-full bg-purple-600 text-white px-4 py-2 rounded mb-2'
        >
          類似色を生成
        </button>
        <div>
          {generatedColors.map((color, index) => (
            <div key={color.name} className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.hex }}
              ></div>
              <span>{color.name}</span>
            </div>
          ))}
        </div>
        <PaletteGenerator baseHex={hex} />
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>キャンセル</button>
          <button
            onClick={addColor}
            className="bg-black text-white px-4 py-2 rounded"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  )
}