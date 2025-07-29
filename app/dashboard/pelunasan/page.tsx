import PiutangPage from "@/components/pelunasan/PiutangPage";
import UtangPage from "@/components/pelunasan/UtangPage";
import CustomTabs from "@/components/Tabs";
import { Box } from "@mui/material";

export default function PelunasanPage() {
  const tabData = [
    { label: "Utang", content: <UtangPage /> },
    { label: "Piutang", content: <PiutangPage /> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
