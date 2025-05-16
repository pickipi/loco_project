"use client"

import { useState } from "react"
import styles from "./hero.module.css"

const slides = [
  {
    id: 1,
    title: "파티룸 찾을 때 쿠폰 할인 받으세요",
    subtitle: "쿠폰 제공 파티룸 바로가기",
    bgColor: "#ef4444",
    textColor: "white",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    title: "새로운 공간을 발견하세요",
    subtitle: "특별한 이벤트를 위한 공간",
    bgColor: "#3b82f6",
    textColor: "white",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    title: "지금 예약하고 할인받기",
    subtitle: "한정 프로모션 진행중",
    bgColor: "#22c55e",
    textColor: "white",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    title: "특별한 날을 위한 특별한 공간",
    subtitle: "프리미엄 공간 둘러보기",
    bgColor: "#a855f7",
    textColor: "white",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.slide}
        style={{ backgroundColor: slides[currentSlide].bgColor }}
      >
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2
              className={styles.title}
              style={{ color: slides[currentSlide].textColor }}
            >
              {slides[currentSlide].title}
            </h2>
            <p
              className={styles.subtitle}
              style={{ color: slides[currentSlide].textColor }}
            >
              {slides[currentSlide].subtitle}
            </p>
          </div>
          <div className={styles.imageContainer}>
            <img
              src={slides[currentSlide].image}
              alt="Promotional image"
              className={styles.image}
            />
          </div>
        </div>
      </div>

      <button className={styles.prevButton} onClick={prevSlide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className={styles.srOnly}>Previous slide</span>
      </button>

      <button className={styles.nextButton} onClick={nextSlide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className={styles.srOnly}>Next slide</span>
      </button>

      <div className={styles.pagination}>
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
} 