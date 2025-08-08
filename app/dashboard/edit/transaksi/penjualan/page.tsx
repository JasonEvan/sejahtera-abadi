"use client";

import AddTransaksiForm from "@/components/edit/transaksi/AddTransaksiForm";
import ClientInformation from "@/components/edit/transaksi/ClientInformation";
import JualHistoryContainer from "@/components/edit/transaksi/JualHistoryContainer";
import NoteSummary from "@/components/edit/transaksi/NoteSummary";
import NoteTable from "@/components/edit/transaksi/NoteTable";
import { useEditJualStore } from "@/hooks/edit/useEditTransaksiStore";
import { modals } from "@/lib/modal";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

export default function PenjualanPage() {
  const {
    clientInformationDone,
    decrementalId,
    menuNotaLoading,
    menuNota,
    menuBarang,
    menuBarangLoading,
    dataNota,
    diskonNota,
    totalAkhir,
    nilaiNota,
    isSubmitting,
    submitEdit,
    setDiskonNota,
    fetchMenuNota,
    setClientInformation,
    setClientInformationDone,
    fetchDataNota,
    fetchMenuBarang,
    addDataNota,
    deleteDataNota,
  } = useEditJualStore();

  const handleAdd = () => {
    modals.open({
      title: "Tambah Barang",
      type: "form",
      size: "sm",
      children: (
        <AddTransaksiForm
          addDataNota={addDataNota}
          decrementalId={decrementalId}
          menuBarang={menuBarang}
          menuBarangLoading={menuBarangLoading}
          dataNota={dataNota}
        />
      ),
    });
  };

  const handleCheck = () => {
    modals.open({
      title: "Cek Harga",
      type: "text",
      size: "sm",
      children: <JualHistoryContainer />,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Penjualan
      </Typography>
      <ClientInformation
        clientInformationDone={clientInformationDone}
        menuNotaLoading={menuNotaLoading}
        menuNota={menuNota}
        fetchMenuNota={fetchMenuNota}
        setClientInformation={setClientInformation}
        setClientInformationDone={setClientInformationDone}
        fetchDataNota={fetchDataNota}
        fetchMenuBarang={fetchMenuBarang}
      />
      <Divider sx={{ color: "#cccccc" }}>Data Nota</Divider>
      <Box sx={{ display: clientInformationDone ? "block" : "none" }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
          <Button variant="contained" onClick={handleCheck}>
            Check Harga
          </Button>
        </Stack>
        <NoteTable dataNota={dataNota} deleteDataNota={deleteDataNota} />
        <NoteSummary
          diskon={diskonNota}
          totalAkhir={totalAkhir}
          nilaiNota={nilaiNota}
          isLoading={isSubmitting}
          setDiskonNota={setDiskonNota}
          submitEdit={submitEdit}
        />
      </Box>
    </Box>
  );
}
