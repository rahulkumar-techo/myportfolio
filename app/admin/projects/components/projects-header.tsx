'use client'

import { Input } from '@/components/ui/input'

type ProjectsHeaderProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function ProjectsHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground">Create, edit, feature, and remove portfolio projects.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects"
          className="sm:w-64"
        />

        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
