'use client'

import React, { useState } from 'react'

interface TagInputProps {
  tags: string[]
  maxTags: number
  placeholder: string
  onAddTag: (tag: string) => void
  onRemoveTag: (index: number) => void
}

export default function TagInput({
  tags,
  maxTags,
  placeholder,
  onAddTag,
  onRemoveTag
}: TagInputProps) {
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    if (newTag && tags.length < maxTags) {
      onAddTag(newTag)
      setNewTag('')
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder={placeholder}
          maxLength={20}
        />
        <button
          type="button"
          onClick={handleAddTag}
          disabled={tags.length >= maxTags}
          className="px-4 py-2 bg-[#7047EB] text-white rounded-md disabled:bg-gray-300"
        >
          추가
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#7047EB] text-white rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="ml-2"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">최대 {maxTags}개까지 입력 가능합니다.</p>
    </div>
  )
} 