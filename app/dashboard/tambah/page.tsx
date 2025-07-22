import CustomTabs from "@/components/Tabs";
import TambahBarang from "@/components/tambah/TambahBarang";
import TambahClient from "@/components/tambah/TambahClient";
import TambahSalesman from "@/components/tambah/TambahSalesman";
import { Box } from "@mui/material";

export default function TambahPage() {
  const tabData = [
    { label: "Barang", content: <TambahBarang /> },
    { label: "Client", content: <TambahClient /> },
    { label: "Salesman", content: <TambahSalesman /> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
