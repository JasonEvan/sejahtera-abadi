export interface TambahBarangFormValues {
  nama: string;
  satuan: string;
  stockawal: number;
  barangrusak: number;
  modal: number;
  hargabeli: number;
  hargajual?: number | null; // Optional field for selling price
}
