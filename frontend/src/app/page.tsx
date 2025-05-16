"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import styles from "./page.module.css"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "party", name: "파티룸", icon: "🎉" },
    { id: "studio", name: "스튜디오", icon: "📸" },
    { id: "conference", name: "회의실/세미나", icon: "💼" },
    { id: "practice", name: "연습실", icon: "🎭" },
    { id: "dance", name: "댄스연습실", icon: "💃" },
    { id: "recording", name: "녹음실", icon: "🎙" },
    { id: "kitchen", name: "공유주방", icon: "👨‍🍳" },
    { id: "cafe", name: "카페", icon: "☕" },
    { id: "office", name: "독립오피스", icon: "💻" },
    { id: "desk", name: "공유데스크", icon: "🪑" },
    { id: "atelier", name: "작업실", icon: "🎨" },
    { id: "gallery", name: "갤러리", icon: "🖼" },
  ]

  const popularSpaces = [
    {
      id: 1,
      title: "도심 속 힐링 루프탑",
      location: "강남구 · 논현동",
      price: "시간당 50,000원",
      rating: 4.5,
      reviews: 123,
      image: "/placeholder.jpg"
    },
    {
      id: 2,
      title: "모던한 스튜디오",
      location: "마포구 · 합정동",
      price: "시간당 70,000원",
      rating: 4.8,
      reviews: 89,
      image: "/placeholder.jpg"
    },
    // ... 더 많은 공간들
  ]

  const regions = [
    "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "제주"
  ]

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section with Slider */}
        <section className={styles.heroSlider}>
          <div className={styles.slide}>
            <h1>새로운 공간을 발견하세요</h1>
            <p>원하는 아이디어를 위한 공간</p>
          </div>
        </section>

        {/* Category Section */}
        <section className={styles.categorySection}>
          <h2>찾는 공간이 있나요?</h2>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <Link 
                href={`/category/${category.id}`} 
                key={category.id}
                className={styles.categoryItem}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Spaces Section */}
        <section className={styles.spacesSection}>
          <div className={styles.sectionHeader}>
            <h2>인기 공간</h2>
            <Link href="/spaces/popular" className={styles.moreLink}>
              더보기
            </Link>
          </div>
          <div className={styles.spaceGrid}>
            {popularSpaces.map((space) => (
              <Link href={`/spaces/${space.id}`} key={space.id} className={styles.spaceCard}>
                <div className={styles.spaceImageContainer}>
                  <Image
                    src={space.image}
                    alt={space.title}
                    fill
                    className={styles.spaceImage}
                  />
                </div>
                <div className={styles.spaceInfo}>
                  <h3>{space.title}</h3>
                  <p>{space.location}</p>
                  <p className={styles.price}>{space.price}</p>
                  <div className={styles.rating}>
                    ⭐ {space.rating} ({space.reviews})
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Regional Section */}
        <section className={styles.regionSection}>
          <h2>지역별 공간</h2>
          <div className={styles.regionGrid}>
            {regions.map((region) => (
              <Link
                href={`/region/${region}`}
                key={region}
                className={styles.regionButton}
              >
                {region}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
