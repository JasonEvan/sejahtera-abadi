import ReturBeliPage from "@/components/retur/ReturBeliPage";
import ReturJualPage from "@/components/retur/ReturJualPage";
import CustomTabs from "@/components/Tabs";
import { Box } from "@mui/material";

export default function ReturPage() {
  const tabData = [
    {
      label: "Beli",
      content: <ReturBeliPage />,
    },
    { label: "Jual", content: <ReturJualPage /> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
