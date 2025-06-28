import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function GalleryCard({
  image,
  isAdmin = false,
  onDelete,
  onClick,
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl shadow-md bg-white transition-all cursor-pointer group"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      onClick={() => onClick && onClick(image)}>
      <div className="relative w-full h-60">
        <Image
          src={image.url}
          alt={image.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="text-lg font-semibold truncate">{image.title}</h3>
        <p className="text-sm text-gray-500 truncate">{image.description}</p>
      </div>

      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
          title="Hapus">
          <Trash2 size={16} />
        </button>
      )}
    </motion.div>
  );
}
