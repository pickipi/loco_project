import React, { useState } from "react";
import { ReportFormData } from "@/types/review";

interface ReportFormProps {
  reviewId: number;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onCancel: () => void;
}

const REPORT_REASONS = [
  "부적절한 언어 사용",
  "스팸 또는 광고",
  "개인정보 노출",
  "기타",
];

const ReportForm: React.FC<ReportFormProps> = ({
  reviewId,
  onSubmit,
  onCancel,
}) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [detail, setDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        reviewId,
        reason,
        detail,
      });
    } catch (error) {
      console.error("신고 제출 중 오류 발생:", error);
      alert("신고 접수에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          신고 사유
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {REPORT_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상세 내용
        </label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          required
          placeholder="신고 사유에 대한 상세 내용을 입력해주세요."
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {isSubmitting ? "제출 중..." : "신고하기"}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
