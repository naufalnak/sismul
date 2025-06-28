import { useEffect, useState } from "react";
import GalleryCard from "@/components/GalleryCard";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SortableGallery from "@/components/SortableGallery";

Modal.setAppElement("#__next"); // Diperlukan untuk accessibility

export default function AdminPage() {
  const [gallery, setGallery] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setGallery(data);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Gambar akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Gambar dihapus!");
        fetchGallery();
      } else {
        toast.error("Gagal menghapus gambar.");
      }
    }
  };

  const handleAdd = async () => {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    if (res.ok) {
      toast.success("Gambar ditambahkan!");
      setNewItem({ title: "", url: "", description: "" });
      setModalIsOpen(false);
      fetchGallery();
    } else {
      toast.error("Gagal menambahkan gambar.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Gallery</h1>
        <button
          onClick={() => setModalIsOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          + Tambah Gambar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => {
          return (
            <GalleryCard
              key={item.id}
              image={item}
              isAdmin={true}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Tambah Gambar"
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center">
        <h2 className="text-lg font-semibold mb-4">Tambah Gambar</h2>
        <input
          type="text"
          placeholder="Judul"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full mb-2 border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="URL Gambar (ex: /images/pic.jpg)"
          value={newItem.url}
          onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
          className="w-full mb-2 border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Deskripsi"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          className="w-full mb-4 border px-3 py-2 rounded"></textarea>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded">
            Batal
          </button>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Simpan
          </button>
        </div>
      </Modal>
    </div>
  );
}
