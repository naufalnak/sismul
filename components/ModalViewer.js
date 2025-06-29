import Modal from "react-modal";
import Image from "next/image";
import { X, MapPin } from "lucide-react";

Modal.setAppElement("#__next");

export default function ModalViewer({ isOpen, image, onClose }) {
  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Preview Gambar"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all"
      className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl outline-none p-6 sm:p-8">
      {/* Tombol Close */}{" "}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        aria-label="Tutup">
        <X size={22} />{" "}
      </button>
      {/* Gambar */}{" "}
      <div className="w-full overflow-hidden rounded-lg">
        {" "}
        <div className="w-full aspect-[16/9] relative rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt={image.title}
            fill
            className="object-cover"
          />
        </div>{" "}
      </div>
      {/* Konten */}{" "}
      <div className="mt-6 space-y-2">
        {" "}
        <h2 className="text-2xl font-semibold text-gray-800">
          {image.title}
        </h2>{" "}
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base text-justify">
          {image.description}{" "}
        </p>{" "}
        {image.maps_url && (
          <a
            href={image.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium transition">
            <MapPin className="w-4 h-4" /> Lihat di Google Maps{" "}
          </a>
        )}{" "}
      </div>{" "}
    </Modal>
  );
}
