import api from "@/lib/axios";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await api.post<{ message: string }>("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await api.get<{ message: string }>("/auth/logout");
  return response.data;
}
