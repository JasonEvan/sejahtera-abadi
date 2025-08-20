"use client";

import FormLangganan from "@/components/lihat/piutang/FormLangganan";
import PiutangLanggananTable from "@/components/lihat/piutang/PiutangLanggananTable";
import { Box, Typography } from "@mui/material";

export default function PiutangPerLanggananPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Piutang Langganan
      </Typography>
      <FormLangganan />
      <PiutangLanggananTable />
    </Box>
  );
}
