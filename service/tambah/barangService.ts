import api from "@/lib/axios";

export interface TambahBarangData {
  nama: string;
  satuan: string;
  stockawal: number;
  modal: number;
  hargabeli: number;
  hargajual: number;
}

export const tambahBarang = async (
  data: TambahBarangData,
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/barang", data);
  return response.data;
};
