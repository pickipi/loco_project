"use client";

interface TimeSelectorProps {
  selectedTime: string;
  onChange: (time: string) => void;
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function TimeSelector({
  selectedTime,
  onChange,
}: TimeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {TIME_SLOTS.map((time) => (
        <button
          key={time}
          onClick={() => onChange(time)}
          className={`p-2 rounded-lg border ${
            selectedTime === time
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
