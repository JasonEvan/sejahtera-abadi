"use client";

import NotaTable from "@/components/lihat/nota/NotaTable";
import { useDetailNotaStore } from "@/hooks/useDetailNotaStore";
import { Box } from "@mui/material";

export default function NotaPembelianPage() {
  const { details, total } = useDetailNotaStore();

  return (
    <Box sx={{ paddingTop: 3 }}>
      <NotaTable data={details} totalHargaSemua={total} />
    </Box>
  );
}
