import { useEffect, useState } from "react";
import SortableGallery from "@/components/SortableGallery";
import ModalViewer from "@/components/ModalViewer";

export default function Home() {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setGallery(data);
        setFilteredGallery(data);
      });
  }, []); // Handle search

  useEffect(() => {
    const keyword = searchQuery.toLowerCase();
    const results = gallery.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
    setFilteredGallery(results);
  }, [searchQuery, gallery]);

  return (
    <main className="min-h-screen bg-white text-gray-800 py-16 px-6 lg:px-20">
      {" "}
      <section className="max-w-7xl mx-auto">
        {" "}
        <header className="mb-14 text-center">
          {" "}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Rekomendasi Wisata Terbaik{" "}
          </h1>{" "}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan destinasi wisata pilihan dengan visual menarik dan deskripsi
            informatif.{" "}
          </p>{" "}
        </header>
        {/* Input Pencarian */}{" "}
        <div className="max-w-xl mx-auto mb-10">
          {" "}
          <input
            type="text"
            placeholder="Cari lokasi wisata..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />{" "}
        </div>{" "}
        <SortableGallery images={filteredGallery} onView={setSelectedImage} />{" "}
      </section>{" "}
      <ModalViewer
        isOpen={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />{" "}
    </main>
  );
}
