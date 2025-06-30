import Image from "next/image";
import { MapPin, Trash2, Pencil } from "lucide-react";

export default function GalleryCard({
  image,
  onClick,
  onDelete,
  onEdit,
  isAdmin = false,
}) {
  return (
    <div
      onClick={() => !isAdmin && onClick?.(image)}
      className="group relative bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden cursor-pointer">
      <div className="relative aspect-[5/3] w-full rounded-lg overflow-hidden">
        <Image
          src={image.url}
          alt={image.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{image.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {image.description}
        </p>
        {image.maps_url && (
          <a
            href={image.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-sm text-blue-600 mt-2 hover:underline">
            <MapPin className="w-4 h-4 mr-1" /> Lihat di Maps
          </a>
        )}
      </div>

      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(image);
            }}
            className="bg-white p-1 rounded-full shadow text-blue-500 hover:bg-blue-500 hover:text-white transition">
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(image.id);
            }}
            className="bg-white p-1 rounded-full shadow text-red-500 hover:bg-red-500 hover:text-white transition">
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
