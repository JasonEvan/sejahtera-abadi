import { getSalesmenNames } from "@/service/tambah/salesService";
import { useQuery } from "@tanstack/react-query";

export const useNamaSales = () => {
  return useQuery({
    queryKey: ["salesman", "names"],
    queryFn: getSalesmenNames,
    select: (data) => data.data.map((salesman) => salesman.nama_sales),
  });
};
