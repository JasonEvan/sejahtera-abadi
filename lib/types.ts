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

export interface PelunasanDTO {
  id: number;
  nomor_transaksi: string;
  tanggal_lunas: string;
  id_client: number;
  nomor_nota: string;
  lunas_nota: number;
  nota: {
    nilai_nota: number;
  };
}

export interface UpdatePelunasanDTO {
  dataPelunasan: {
    id: number;
    nomor_transaksi: string;
    tanggal_lunas: string;
    nomor_nota: string;
    lunas_nota: number;
    saldo_nota: number;
    id_client: number;
  }[];
  nilai_nota: number;
  lunas_nota: number;
  saldo_nota: number;
  lunas_lama: number;
}

// Persediaan Table Row Interface
export interface TableRow {
  nomor_nota: string;
  tanggal_nota: string;
  nama_client: string;
  kota_client: string;
  tipe: string;
  harga: number;
  qty_in: number | null;
  qty_out: number | null;
  qty_akhir: number;
}

export interface PersediaanDTO {
  data: TableRow[];
  summary: {
    totalQtyIn: number;
    totalQtyOut: number;
    stockAwal: number;
    finalStock: number;
  };
}

export interface UtangTableRow {
  nama_client: string;
  kota_client: string;
  nomor_nota: string;
  tanggal_nota: string;
  nilai_nota: string;
  lunas_nota: string;
  tanggal_lunas: string;
  saldo_nota: string;
}

export interface UtangSemuaDTO {
  data: UtangTableRow[];
  summary: {
    totalNilaiNota: string;
    totalLunasNota: string;
    sisaUtang: string;
  };
}

export interface PiutangSemuaDTO {
  data: UtangTableRow[];
  summary: {
    totalNilaiNota: string;
    totalLunasNota: string;
    sisaPiutang: string;
  };
}

export interface DetailUtangTableRow {
  nomor_nota: string;
  tanggal_nota: string;
  nilai_nota: string;
  lunas_nota: string;
  tanggal_lunas: string;
  saldo_nota: string;
}

export interface DetailTransaksiTableRow {
  nomor_nota: string;
  tanggal_nota: string;
  nama_client: string;
  kota_client: string;
  nama_barang: string;
  qty_barang: number;
  harga_barang: string;
  total_harga: string;
}

export interface LabaQueryResult {
  nama_sales: string;
  nomor_nota: string;
  tanggal_nota: Date;
  nama_client: string | null;
  kota_client: string | null;
  total_nota: string;
  laba_nota: string;
}

export type FormattedInvoice = Omit<
  LabaQueryResult,
  "nama_sales" | "tanggal_nota"
> & {
  tanggal_nota: string;
};

export interface LaporanLaba {
  groupedBySales: Record<
    string,
    {
      invoices: FormattedInvoice[];
      summary: {
        totalNota: number;
        totalLaba: number;
      };
    }
  >;
  grandSummary: {
    grandTotalNota: number;
    grandTotalLaba: number;
  };
}
