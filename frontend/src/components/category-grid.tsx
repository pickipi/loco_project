import Link from "next/link"
import { categories } from "@/data/categories"
import styles from "./category-grid.module.css"

interface CategoryGridProps {
  activeCategory: string
  activeFilters: string[]
}

export default function CategoryGrid({ activeCategory, activeFilters }: CategoryGridProps) {
  const filteredCategories = categories.filter((category) => {
    if (activeCategory === "all") {
      if (activeFilters.length > 0) {
        return activeFilters.includes(category.id)
      }
      return true
    }

    const matchesCategory = category.type === activeCategory

    if (activeFilters.length > 0) {
      return matchesCategory && activeFilters.includes(category.id)
    }

    return matchesCategory
  })

  return (
    <div className={styles.grid}>
      {filteredCategories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className={styles.category}
        >
          <div className={styles.icon}>{category.icon}</div>
          <span className={styles.name}>{category.name}</span>
          {category.isNew && (
            <span className={styles.badge}>NEW</span>
          )}
        </Link>
      ))}
    </div>
  )
} 