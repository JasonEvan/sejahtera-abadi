"use client";

import DeleteData from "@/components/backup/DeleteData";
import Download from "@/components/backup/Download";
import Restore from "@/components/backup/Restore";
import { Box, Divider } from "@mui/material";

export default function BackupPage() {
  return (
    <Box>
      <Download />
      <Divider sx={{ my: 5 }} />
      <Restore />
      <Divider sx={{ my: 5 }} />
      <DeleteData />
    </Box>
  );
}
