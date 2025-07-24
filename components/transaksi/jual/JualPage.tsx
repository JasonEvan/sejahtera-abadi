"use client";

import { Box, Divider } from "@mui/material";
import ClientInformation from "./ClientInformation";
import NoteInformation from "./NoteInformation";

export default function JualPage() {
  return (
    <Box sx={{ padding: 2 }}>
      <ClientInformation />
      <Divider sx={{ color: "#cccccc" }}>Data Penjualan</Divider>
      <NoteInformation />
    </Box>
  );
}
