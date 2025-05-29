import styles from './DeleteAccountModal.module.css';

// 모달 컴포넌트 props 타입 정의
interface DeleteAccountModalProps {
  isOpen: boolean;      // 모달 표시 여부
  onClose: () => void;  // 모달 닫기 핸들러
  onConfirm: () => void; // 탈퇴 확인 핸들러
  isLoading: boolean;    // 처리 중 상태
}

// 회원 탈퇴 확인 모달 컴포넌트
export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: DeleteAccountModalProps) {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 모달 오버레이 (배경 딤처리)
    <div className={styles.modalOverlay}>
      {/* 모달 컨텐츠 */}
      <div className={styles.modalContent}>
        {/* 모달 제목 */}
        <h2 className={styles.modalTitle}>회원 탈퇴</h2>
        {/* 경고 메시지 */}
        <p className={styles.modalText}>
          정말로 탈퇴하시겠습니까?<br />
          탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        {/* 버튼 그룹 */}
        <div className={styles.modalButtons}>
          {/* 취소 버튼 */}
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
          {/* 탈퇴 확인 버튼 */}
          <button 
            className={styles.deleteButton} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '처리중...' : '탈퇴하기'}
          </button>
        </div>
      </div>
    </div>
  );
} 