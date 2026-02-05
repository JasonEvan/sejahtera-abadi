import api from "@/lib/axios";

export async function backupData() {
  const response = await api.get<Blob>("/backup", {
    responseType: "blob",
  });

  return response.data;
}

export async function restoreData(file: File) {
  const formData = new FormData();
  formData.set("file", file);

  const response = await api.post<{ message: string }>("/backup", formData);

  return response.data;
}

export async function deleteData() {
  const response = await api.delete<{ message: string }>("/backup");

  return response.data;
}
