"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { CategoryDto } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CategoryCardProps {
  category: CategoryDto
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const imageUrl = category.image ? getMinioUrl(category.image) : "/placeholder.jpg";

  return (
    <Link href={`/browse?category=${category.slug}`} passHref>
      <Card className="group relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
        <Image
          src={imageUrl}
          alt={category.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          style={{ objectFit: "cover" }}
          className="transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-green-400 transition-colors">
            {category.title}
          </h3>
          {category.watchers > 0 && (
            <Badge className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold mt-1 flex items-center w-fit">
              <Users className="w-3 h-3 mr-1" />
              {category.watchers} watching
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  )
}