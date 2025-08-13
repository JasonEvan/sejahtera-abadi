"use client";

import ClientInformation from "@/components/edit/retur/ClientInformation";
import NoteTable from "@/components/edit/retur/NoteTable";
import NoteSummary from "@/components/retur/NoteSummary";
import { useEditReturJualStore } from "@/hooks/edit/useEditReturStore";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ReturJualPage() {
  const {
    nomorNotaDone,
    nomorNotaLoading,
    nomorNotaOption,
    dataRetur,
    diskon,
    nilaiRetur,
    totalAkhir,
    isSubmitting,
    returBarang,
    fetchNomorNotaOption,
    setNomorNota,
    setNomorNotaDone,
    fetchDataRetur,
    submitEditRetur,
  } = useEditReturJualStore();

  useEffect(() => {
    fetchNomorNotaOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Retur Jual
      </Typography>
      <ClientInformation
        nomorNotaDone={nomorNotaDone}
        nomorNotaLoading={nomorNotaLoading}
        nomorNotaOption={nomorNotaOption}
        setNomorNota={setNomorNota}
        setNomorNotaDone={setNomorNotaDone}
        fetchDataRetur={fetchDataRetur}
      />
      <Divider sx={{ color: "#cccccc" }}>Data Retur</Divider>
      <Box sx={{ display: nomorNotaDone ? "block" : "none", marginTop: 2 }}>
        <NoteTable dataNota={dataRetur} returBarang={returBarang} />
        <NoteSummary
          diskon={diskon}
          nilaiRetur={nilaiRetur}
          totalAkhir={totalAkhir}
          isLoading={isSubmitting}
          submitRetur={submitEditRetur}
        />
      </Box>
    </Box>
  );
}
