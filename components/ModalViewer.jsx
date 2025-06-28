import Modal from "react-modal";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ModalViewer({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) {
  if (!images || images.length === 0 || currentIndex === null) return null;

  const image = images[currentIndex];

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Preview Gambar"
      className="relative w-full max-w-5xl mx-auto bg-white rounded-lg shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 z-10"
        title="Tutup">
        <X size={20} />
      </button>

      {/* Navigasi Kiri */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:bg-gray-100">
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Navigasi Kanan */}
      {hasNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:bg-gray-100">
          <ChevronRight size={24} />
        </button>
      )}

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative w-full h-[60vh] lg:w-2/3">
          <Image
            src={image.url}
            alt={image.title}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <div className="w-full lg:w-1/3 text-left">
          <h2 className="text-xl font-bold mb-2">{image.title}</h2>
          <p className="text-gray-600">{image.description}</p>
        </div>
      </div>
    </Modal>
  );
}
