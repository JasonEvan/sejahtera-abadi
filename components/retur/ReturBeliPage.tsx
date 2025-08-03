"use client";

import { Box, Typography } from "@mui/material";
import ClientInformation from "./ClientInformation";
import { useReturBeliStore } from "@/hooks/useReturStore";
import NoteTable from "./NoteTable";
import NoteSummary from "./NoteSummary";

export default function ReturBeliPage() {
  const {
    clientInformationDone,
    isLoading: menuNotaLoading,
    menuNota,
    dataNota,
    diskon,
    totalAkhir,
    nilaiRetur,
    isSubmitting,
    setClientInformation,
    setClientInformationDone,
    fetchDataNota,
    fetchMenuNota,
    returBarang,
    submitRetur,
    resetAll,
  } = useReturBeliStore();
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Retur Beli Page
      </Typography>
      <ClientInformation
        clientInformationDone={clientInformationDone}
        isLoading={menuNotaLoading}
        menuNota={menuNota}
        setClientInformation={setClientInformation}
        setClientInformationDone={setClientInformationDone}
        fetchDataNota={fetchDataNota}
        fetchMenuNota={fetchMenuNota}
        resetAll={resetAll}
      />
      <Box
        sx={{ marginTop: 2, display: clientInformationDone ? "block" : "none" }}
      >
        <NoteTable dataNota={dataNota} returBarang={returBarang} />
        <NoteSummary
          diskon={diskon}
          totalAkhir={totalAkhir}
          nilaiRetur={nilaiRetur}
          submitRetur={submitRetur}
          isLoading={isSubmitting}
        />
      </Box>
    </Box>
  );
}
