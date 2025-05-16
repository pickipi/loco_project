"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import styles from "./calendar.module.css";

interface CalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

export default function Calendar({ selectedDate, onChange }: CalendarProps) {
  return (
    <div className={styles.container}>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
        minDate={new Date()}
        className={styles.datePicker}
        placeholderText="날짜를 선택해주세요"
      />
    </div>
  );
}
