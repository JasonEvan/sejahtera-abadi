import api from "@/lib/axios";

interface TambahSalesmanData {
  nama: string;
  nomordepan: number;
  telepon: string;
  kode: string;
}

export const tambahSales = async (
  data: TambahSalesmanData,
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/sales", data);
  return response.data;
};
