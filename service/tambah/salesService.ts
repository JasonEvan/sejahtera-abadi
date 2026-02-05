import { salesman } from "@/app/generated/prisma";
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

export const getSalesmen = async () => {
  const response = await api.get<{ data: salesman[] }>("/sales");
  return response.data;
};

export const getSalesmenNames = async () => {
  const response = await api.get<{ data: salesman[] }>(
    "/sales?onlysalesname=true",
  );
  return response.data;
};
