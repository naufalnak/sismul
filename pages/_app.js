import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

// Inisialisasi react-modal untuk aksesibilitas
Modal.setAppElement("#__next");

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
