import { salesman } from "@/app/generated/prisma";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "@/lib/axios";

export const useLastNomorNota = () => {
  const [lastNomorNota, setLastNomorNota] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLastNomorNota = async (namaSales: string) => {
    setIsLoading(true);
    try {
      const params = {
        namasales: namaSales,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: salesman[] }>(
        `/sales?${queryParams.toString()}`,
      );
      const { data } = response.data;

      const lastNum = (data[0].no_nota + 1).toString().padStart(5, "0");

      setLastNomorNota(
        `${data[0].no_depan ? data[0].no_depan.toString() : "0"}${lastNum}`,
      );
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLastNomorNota(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { lastNomorNota, isLoading, fetchLastNomorNota };
};
