"use client"

import { categoryTypes, filters } from "@/data/categories"
import styles from "./category-nav.module.css"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  activeFilters: string[]
  onFilterToggle: (filterId: string) => void
}

export default function CategoryNav({
  activeCategory,
  onCategoryChange,
  activeFilters,
  onFilterToggle,
}: CategoryNavProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>찾는 공간이 있나요?</h2>

      <div className={styles.filterContainer}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterButton} ${
              activeFilters.includes(filter.id) ? styles.filterButtonActive : ""
            }`}
            onClick={() => onFilterToggle(filter.id)}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className={styles.categoryNav}>
        <div className={styles.categoryList}>
          {categoryTypes.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                activeCategory === category.id ? styles.categoryButtonActive : ""
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 