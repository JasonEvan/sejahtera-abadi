"use client";

import Download from "@/components/backup/Download";
import { Box, Divider } from "@mui/material";

export default function BackupPage() {
  return (
    <Box>
      <Download />
      <Divider sx={{ my: 5 }} />
    </Box>
  );
}
