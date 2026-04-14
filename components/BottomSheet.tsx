"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({ open, onClose, children }: Props) {
  return (
    <>
      {/* 背景 */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 transition-opacity
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* シート */}
      <div
        className={`
          fixed bottom-0 left-0 right-0
          bg-white rounded-t-2xl p-4
          transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* ハンドル */}
        <div className="w-12 h-1.5 bg-gray-300 rounded mx-auto mb-4" />

        {children}
      </div>
    </>
  );
}
