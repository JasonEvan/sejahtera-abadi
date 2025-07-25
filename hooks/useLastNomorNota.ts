import { salesman } from "@/app/generated/prisma";
import { useState } from "react";
import Swal from "sweetalert2";

export const useLastNomorNota = () => {
  const [lastNomorNota, setLastNomorNota] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLastNomorNota = async (namaSales: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sales?namasales=${namaSales}`, {
        cache: "no-store",
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch last nomor nota");
      }

      const { data }: { data: salesman[] } = await res.json();

      const lastNum = (data[0].no_nota + 1).toString().padStart(5, "0");

      setLastNomorNota(
        `${data[0].no_depan ? data[0].no_depan.toString() : "0"}${lastNum}`
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
