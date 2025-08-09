import { DataPembelianI } from "@/hooks/useBeliStore";
import { DataPenjualanI } from "@/hooks/useJualStore";
import { DataPelunasanI } from "@/hooks/useLunasStore";
import { NotaI } from "@/hooks/useReturStore";

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
  kotaClient: string;
  dataPenjualan: DataPenjualanI[];
  totalPenjualan: number;
  diskon: number;
  totalAkhir: number;
}

export interface BeliDTO {
  namaClient: string;
  nomorNota: string;
  tanggalNota: string;
  kotaClient: string;
  dataPembelian: DataPembelianI[];
  totalPembelian: number;
  diskon: number;
  totalAkhir: number;
}

export interface PelunasanDTO {
  namaClient: string;
  kotaClient: string;
  nomorTransaksi: string;
  tanggal: string;
  dataPelunasan: DataPelunasanI[];
}

export interface ReturDTO {
  namaClient: string;
  kotaClient: string;
  nomorNota: string;
  tanggal: string;
  dataNota: NotaI[];
  diskon: number;
  totalAkhir: number;
  nilaiRetur: number;
}

export interface EditDTO {
  namaClient: string;
  kotaClient: string;
  nomorNota: string;
  dataNota: EditNotaTransaksiI[];
  nilaiNota: number;
  diskonNota: number;
  totalAkhir: number;
}

export interface EditNotaTransaksiI {
  id: number;
  nama_barang: string;
  harga_barang: number;
  qty_barang: number;
  total_harga: number;
  diskon_nota: number;
}
