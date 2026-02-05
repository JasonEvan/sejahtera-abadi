import { client } from "@/app/generated/prisma";
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

export const getClientNames = async () => {
  const response = await api.get<{ data: client[] }>(
    "/client?onlyclientsname=true",
  );

  return response.data;
};
