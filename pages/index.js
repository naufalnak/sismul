import { useEffect, useState } from "react";
import GalleryCard from "@/components/GalleryCard";
import ModalViewer from "@/components/ModalViewer";
import Masonry from "react-masonry-css";

export default function Home() {
  const [gallery, setGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const openModal = (index) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setGallery);
  }, []);

  const breakpoints = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 Galeri Gambar</h1>

      <Masonry
        breakpointCols={breakpoints}
        className="flex gap-4"
        columnClassName="masonry-column">
        {gallery.map((item, index) => (
          <GalleryCard
            key={item.id}
            image={item}
            onClick={() => openModal(index)}
          />
        ))}
      </Masonry>

      <ModalViewer
        isOpen={currentIndex !== null}
        images={gallery}
        currentIndex={currentIndex}
        onNavigate={(newIndex) => setCurrentIndex(newIndex)}
        onClose={closeModal}
      />
    </div>
  );
}
