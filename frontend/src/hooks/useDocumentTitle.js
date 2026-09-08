import { useEffect } from "react";

// Dipanggil di setiap halaman, misal:
// useDocumentTitle("Tamu Masuk — BBMKG Wilayah II")
export default function useDocumentTitle(judul) {
  useEffect(() => {
    document.title = judul;
  }, [judul]);
}
