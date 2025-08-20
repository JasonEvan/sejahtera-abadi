"use client";

import FormLangganan from "@/components/lihat/utang/FormLangganan";
import UtangLanggananTable from "@/components/lihat/utang/UtangLanggananTable";
import { Box, Typography } from "@mui/material";

export default function UtangPerLanggananPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Utang Langganan
      </Typography>
      <FormLangganan />
      <UtangLanggananTable />
    </Box>
  );
}
