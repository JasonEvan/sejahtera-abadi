"use client";

import AddTransaksiBeliForm from "@/components/edit/transaksi/AddTransaksiBeliForm";
import BeliHistoryContainer from "@/components/edit/transaksi/BeliHistoryContainer";
import ClientInformation from "@/components/edit/transaksi/ClientInformation";
import NoteSummary from "@/components/edit/transaksi/NoteSummary";
import NoteTable from "@/components/edit/transaksi/NoteTable";
import { useEditBeliStore } from "@/hooks/edit/useEditBeliStore";
import { modals } from "@/lib/modal";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

export default function PembelianPage() {
  const {
    clientInformationDone,
    menuNota,
    menuNotaLoading,
    dataNota,
    diskonNota,
    totalAkhir,
    nilaiNota,
    isSubmitting,
    decrementalId,
    menuBarang,
    menuBarangLoading,
    submitEdit,
    setDiskonNota,
    deleteDataNota,
    fetchMenuNota,
    setClientInformation,
    setClientInformationDone,
    addDataNota,
    fetchDataNota,
    fetchMenuBarang,
  } = useEditBeliStore();

  const handleAdd = () => {
    modals.open({
      title: "Tambah Barang",
      type: "form",
      size: "sm",
      children: (
        <AddTransaksiBeliForm
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
      children: <BeliHistoryContainer />,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Pembelian
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
        <NoteTable
          dataNota={dataNota}
          deleteDataNota={deleteDataNota}
          type="beli"
        />
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
