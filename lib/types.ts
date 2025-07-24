import { DataPenjualanI } from "@/hooks/useJualStore";

export interface TambahBarangFormValues {
  nama: string;
  satuan: string;
  stockawal: number;
  barangrusak: number;
  modal: number;
  hargabeli: number;
  hargajual?: number | null; // Optional field for selling price
}

export interface JualDTO {
  namaLangganan: string;
  namaSales: string;
  nomorNota: string;
  tanggalNota: string;
  dataPenjualan: DataPenjualanI[];
  totalPenjualan: number;
  diskon: number;
  totalAkhir: number;
}
