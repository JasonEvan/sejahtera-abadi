import api from "@/lib/axios";

export interface TambahClientData {
  nama: string;
  kota?: string | null;
  alamat?: string | null;
  telepon?: string | null;
  handphone?: string | null;
}

export const tambahClient = async (
  data: TambahClientData,
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/client", data);
  return response.data;
};
