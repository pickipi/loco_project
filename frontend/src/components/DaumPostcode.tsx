import { useEffect, useRef } from "react";

interface DaumPostcodeProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    daum: any;
  }
}

export default function DaumPostcode({
  onComplete,
  onClose,
}: DaumPostcodeProps) {
  const postcodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadKakaoScript = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src =
          "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    const initializePostcode = async () => {
      await loadKakaoScript();
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          onComplete(data);
        },
        onclose: onClose,
        width: "100%",
        height: "100%",
      }).embed(postcodeRef.current);
    };

    initializePostcode();

    return () => {
      const script = document.querySelector('script[src*="daumcdn"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [onComplete, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-xl rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">주소 검색</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div ref={postcodeRef} className="h-[500px]" />
      </div>
    </div>
  );
}
