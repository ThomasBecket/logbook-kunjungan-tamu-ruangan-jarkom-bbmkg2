import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { muatDataTamu } from "../api/storage";
import socket from "../api/frontendSocket";
import StatusBadge from "../components/StatusBadge";
import DetailKunjunganModal from "../components/DetailKunjunganModal";
import useDocumentTitle from "../hooks/useDocumentTitle";

const OPSI_UKURAN_HALAMAN = [10, 50, 100, 250, 500, "semua"];

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Header kalender custom: nambah dropdown Bulan & Tahun supaya tidak perlu
// klik panah satu-satu untuk lompat ke tahun/bulan yang jauh.
function HeaderKalender({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) {
  const tahunSekarang = new Date().getFullYear();
  const opsiTahun = [];
  for (let t = tahunSekarang + 1; t >= tahunSekarang - 30; t--) opsiTahun.push(t);

  return (
    <div className="datepicker-header">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="datepicker-nav"
      >
        ‹
      </button>
      <select
        value={date.getMonth()}
        onChange={(e) => changeMonth(Number(e.target.value))}
      >
        {NAMA_BULAN.map((nama, index) => (
          <option key={nama} value={index}>
            {nama}
          </option>
        ))}
      </select>
      <select
        value={date.getFullYear()}
        onChange={(e) => changeYear(Number(e.target.value))}
      >
        {opsiTahun.map((tahun) => (
          <option key={tahun} value={tahun}>
            {tahun}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="datepicker-nav"
      >
        ›
      </button>
    </div>
  );
}

export default function AdminRiwayatTamu() {
  useDocumentTitle("Riwayat Tamu — BBMKG Wilayah II");
  const [daftarTamu, setDaftarTamu] = useState([]);
  const [kunjunganDetail, setKunjunganDetail] = useState(null);

  // Filter rentang tanggal — sekarang pakai objek Date (bukan string),
  // dikontrol lewat react-datepicker.
  const [dariTanggal, setDariTanggal] = useState(null);
  const [sampaiTanggal, setSampaiTanggal] = useState(null);

  // Urutan: terlama (ascending) atau terbaru (descending)
  const [urutan, setUrutan] = useState("terbaru");

  // Pagination
  const [ukuranHalaman, setUkuranHalaman] = useState(10);
  const [halamanAktif, setHalamanAktif] = useState(1);

  useEffect(() => {
    async function muatUlang() {
      const data = await muatDataTamu();
      setDaftarTamu(data);
    }

    muatUlang();

    function tanganiPerubahan() {
      muatUlang();
    }

    socket.on("kunjungan:baru", tanganiPerubahan);
    socket.on("kunjungan:diubah", tanganiPerubahan);

    return () => {
      socket.off("kunjungan:baru", tanganiPerubahan);
      socket.off("kunjungan:diubah", tanganiPerubahan);
    };

  }, []);

  const dataTerfilter = useMemo(() => {
    const hasil = daftarTamu.filter((v) => {
      if (!v.waktuMasukIso) return false;
      const waktuKunjungan = new Date(v.waktuMasukIso).getTime();

      if (dariTanggal) {
        const awalHari = new Date(dariTanggal);
        awalHari.setHours(0, 0, 0, 0);
        if (waktuKunjungan < awalHari.getTime()) return false;
      }
      if (sampaiTanggal) {
        const akhirHari = new Date(sampaiTanggal);
        akhirHari.setHours(23, 59, 59, 999);
        if (waktuKunjungan > akhirHari.getTime()) return false;
      }
      return true;
    });

    hasil.sort((a, b) => {
      const waktuA = a.waktuMasukIso ? new Date(a.waktuMasukIso).getTime() : 0;
      const waktuB = b.waktuMasukIso ? new Date(b.waktuMasukIso).getTime() : 0;
      return urutan === "terbaru" ? waktuB - waktuA : waktuA - waktuB;
    });

    return hasil;
  }, [daftarTamu, dariTanggal, sampaiTanggal, urutan]);

  // Balik ke halaman 1 tiap kali filter/urutan/ukuran halaman berubah
  useEffect(() => {
    setHalamanAktif(1);
  }, [dariTanggal, sampaiTanggal, urutan, ukuranHalaman]);

  const totalHalaman =
    ukuranHalaman === "semua"
      ? 1
      : Math.max(1, Math.ceil(dataTerfilter.length / ukuranHalaman));

  const dataDitampilkan = useMemo(() => {
    if (ukuranHalaman === "semua") return dataTerfilter;
    const awal = (halamanAktif - 1) * ukuranHalaman;
    return dataTerfilter.slice(awal, awal + ukuranHalaman);
  }, [dataTerfilter, ukuranHalaman, halamanAktif]);

  const adaFilterAktif = Boolean(dariTanggal || sampaiTanggal);

  function resetFilter() {
    setDariTanggal(null);
    setSampaiTanggal(null);
  }

  function unduhExcel() {
    if (dataTerfilter.length === 0) return;

    const baris = dataTerfilter.map((v) => ({
      "Nomor Kunjungan": v.id,
      "Nama Tamu": (v.namaTamu || []).join(", "),
      "Unit Kerja / Instansi": v.unitKerja,
      Keperluan: v.keperluan,
      Status: v.status,
      "Waktu Masuk": v.waktuMasuk || "-",
      "Waktu Keluar": v.waktuKeluar || "-",
      "Petugas Verifikasi": v.namaPetugasVerifikasi || "-",
      "Alasan Ditolak": v.alasanDitolak || "-",
    }));

    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Riwayat Tamu"],
      [],
    ]);
    XLSX.utils.sheet_add_json(worksheet, baris, { origin: "A3" });

    const jumlahKolom = Object.keys(baris[0]).length;
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: jumlahKolom - 1 },
      },
    ];

    worksheet["A1"].s = {
      font: {
        bold: true,
        sz: 14,
      },
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Tamu");

    const namaFile = `riwayat-tamu-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, namaFile);
  }

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">Panel Petugas</div>
          <h1 style={{ textAlign: "left" }}>Riwayat Tamu</h1>
          <p className="subtitle" style={{ marginLeft: 0, textAlign: "left" }}>
            Seluruh data kunjungan yang pernah tercatat.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-download-excel"
          onClick={unduhExcel}
        >
          Unduh Excel
        </button>
      </div>

      <div className="card filter-bar">
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="dariTanggal">Dari Tanggal</label>
          <DatePicker
            id="dariTanggal"
            selected={dariTanggal}
            onChange={(tanggal) => setDariTanggal(tanggal)}
            selectsStart
            startDate={dariTanggal}
            endDate={sampaiTanggal}
            maxDate={sampaiTanggal || undefined}
            dateFormat="dd/MM/yyyy"
            placeholderText="Pilih tanggal"
            isClearable
            className="date-filter-input"
            renderCustomHeader={HeaderKalender}
          />
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="sampaiTanggal">Sampai Tanggal</label>
          <DatePicker
            id="sampaiTanggal"
            selected={sampaiTanggal}
            onChange={(tanggal) => setSampaiTanggal(tanggal)}
            selectsEnd
            startDate={dariTanggal}
            endDate={sampaiTanggal}
            minDate={dariTanggal || undefined}
            dateFormat="dd/MM/yyyy"
            placeholderText="Pilih tanggal"
            isClearable
            className="date-filter-input"
            renderCustomHeader={HeaderKalender}
          />
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="urutan">Urutan</label>
          <select id="urutan" value={urutan} onChange={(e) => setUrutan(e.target.value)}>
            <option value="terbaru">Terbaru → Terlama</option>
            <option value="terlama">Terlama → Terbaru</option>
          </select>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="ukuranHalaman">Tampilkan</label>
          <select
            id="ukuranHalaman"
            value={ukuranHalaman}
            onChange={(e) =>
              setUkuranHalaman(e.target.value === "semua" ? "semua" : Number(e.target.value))
            }
          >
            {OPSI_UKURAN_HALAMAN.map((opsi) => (
              <option key={opsi} value={opsi}>
                {opsi === "semua" ? "Semua Data" : `${opsi} / halaman`}
              </option>
            ))}
          </select>
        </div>

        {adaFilterAktif && (
          <button type="button" className="btn btn-secondary btn-small" onClick={resetFilter}>
            Hapus Filter
          </button>
        )}
      </div>

      <p className="subtitle" style={{ marginLeft: 0, textAlign: "left", marginBottom: 14 }}>
        Menampilkan {dataDitampilkan.length} dari {dataTerfilter.length} data
        {adaFilterAktif ? " (setelah filter)" : ""}
      </p>

      {dataDitampilkan.length ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>ID Kunjungan</th>
                <th>Nama Tamu</th>
                <th>Unit Kerja / Instansi</th>
                <th>Keperluan</th>
                <th>Waktu Masuk</th>
                <th>Waktu Keluar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataDitampilkan.map((v, index) => {
                const nomorUrut =
                  ukuranHalaman === "semua"
                    ? index + 1
                    : (halamanAktif - 1) * ukuranHalaman + index + 1;
                return (
                  <tr key={v.id} onClick={() => setKunjunganDetail(v)} style={{ cursor: "pointer" }}>
                    <td className="col-no">{nomorUrut}</td>
                    <td className="col-id">{v.id}</td>
                    <td>{(v.namaTamu || []).join(", ")}</td>
                    <td>{v.unitKerja}</td>
                    <td>{v.keperluan}</td>
                    <td>{v.waktuMasuk}</td>
                    <td>{v.waktuKeluar || "-"}</td>
                    <td>
                      <StatusBadge status={v.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty">Tidak ada data untuk filter ini.</div>
      )}

      {ukuranHalaman !== "semua" && totalHalaman > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-secondary btn-small"
            disabled={halamanAktif === 1}
            onClick={() => setHalamanAktif((h) => Math.max(1, h - 1))}
          >
            ← Sebelumnya
          </button>
          <span>
            Halaman {halamanAktif} dari {totalHalaman}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            disabled={halamanAktif === totalHalaman}
            onClick={() => setHalamanAktif((h) => Math.min(totalHalaman, h + 1))}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      <DetailKunjunganModal
        kunjungan={kunjunganDetail}
        onClose={() => setKunjunganDetail(null)}
      />
    </section>
  );
}