"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetTagsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"

interface TagSelectInputProps {
  value: string | null | undefined;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
}

export const TagSelectInput: React.FC<TagSelectInputProps> = ({
  value,
  onValueChange,
  placeholder = "Select a tag",
  error,
}) => {
  const { data, loading, error: tagsError } = useGetTagsQuery({
    variables: {
      order: [{ title: SortEnumType.Asc }],
    },
  });

  const tags = data?.tags?.nodes || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-10 w-full rounded-md border border-input bg-gray-700">
        <Loader2 className="h-5 w-5 animate-spin text-green-500" />
      </div>
    );
  }

  if (tagsError) {
    return (
      <div className="text-red-500 text-sm">Error loading tags: {tagsError.message}</div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      <Select
        value={value || ""}
        onValueChange={(newValue) => onValueChange(newValue === "" ? null : newValue)}
      >
        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="">All Tags</SelectItem> {/* Option to clear tag filter */}
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};