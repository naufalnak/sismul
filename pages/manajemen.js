import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import GalleryCard from "@/components/GalleryCard";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

Modal.setAppElement("#__next");

export default function AdminPage() {
  const [gallery, setGallery] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    url: "",
    description: "",
    maps_url: "",
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
    const formData = new FormData();
    formData.append("title", newItem.title);
    formData.append("description", newItem.description);
    formData.append("maps_url", newItem.maps_url);
    formData.append("file", newItem.file); // gambar

    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Gambar ditambahkan!");
      setNewItem({ title: "", description: "", maps_url: "", file: null });
      setModalIsOpen(false);
      fetchGallery();
    } else {
      toast.error("Gagal menambahkan gambar.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Manajemen Galeri
        </h1>
        <button
          onClick={() => setModalIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2.5 rounded-lg shadow">
          + Tambah Gambar
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          Tidak ada gambar saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <GalleryCard
              key={item.id}
              image={item}
              isAdmin={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Tambah Gambar"
        className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 mx-4 relative z-50"
        overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Tambah Gambar</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Judul"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />

          {/* Custom Upload Field */}
          <div>
            <label
              htmlFor="fileUpload"
              className="flex items-center justify-center gap-2 cursor-pointer border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition w-full">
              <Upload className="w-5 h-5 text-blue-600" />
              <span>{newItem.file ? "Ganti Gambar" : "Pilih Gambar"}</span>
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setNewItem({ ...newItem, file: e.target.files[0] })
              }
            />
            {newItem.file && (
              <p className="mt-2 text-sm text-green-600">
                Dipilih: {newItem.file.name}
              </p>
            )}
          </div>

          <textarea
            placeholder="Deskripsi"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            rows={4}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Google Maps URL"
            value={newItem.maps_url}
            onChange={(e) =>
              setNewItem({ ...newItem, maps_url: e.target.value })
            }
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
            Batal
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Simpan
          </button>
        </div>
      </Modal>
    </div>
  );
}
