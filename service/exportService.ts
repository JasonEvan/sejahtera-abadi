import api from "@/lib/axios";

export async function exportStock(columns: string[]) {
  const response = await api.post<Blob>(
    "/barang/export",
    { columns },
    { responseType: "blob" },
  );

  return response.data;
}
