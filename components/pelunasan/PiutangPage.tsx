"use client";

import { Box, Button, Divider } from "@mui/material";
import ClientInformation from "./ClientInformation";
import { useLunasPiutangStore } from "@/hooks/useLunasStore";
import NoteTable from "./NoteTable";
import NoteForm from "./NoteForm";
import Swal from "sweetalert2";

export default function PiutangPage() {
  const {
    setClientInformation,
    setClientInformationDone,
    fetchNomorNota,
    resetAll,
    removeDataPelunasan,
    setDataPelunasan,
    incrementId,
    submitLunas,
    clientInformationDone,
    dataPelunasan,
    menuNota,
    isLoading,
    incrementalId,
  } = useLunasPiutangStore();

  async function handleSubmit() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All data will be saved",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure!",
    });

    if (result.isConfirmed) {
      const success = await submitLunas();
      if (success) {
        await Swal.fire({
          title: "Success",
          text: "Data has been saved successfully",
          icon: "success",
        });
      } else {
        await Swal.fire({
          title: "Error",
          text: "Failed to save data",
          icon: "error",
        });
      }
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <ClientInformation
        setClientInformation={setClientInformation}
        setClientInformationDone={setClientInformationDone}
        fetchNomorNota={fetchNomorNota}
        resetAll={resetAll}
        clientInformationDone={clientInformationDone}
      />
      <Divider sx={{ color: "#cccccc" }}>Data Utang</Divider>
      <Box
        sx={{ marginTop: 2, display: clientInformationDone ? "block" : "none" }}
      >
        <NoteForm
          dataPelunasan={dataPelunasan}
          menuNota={menuNota}
          menuNotaLoading={isLoading}
          incrementId={incrementId}
          setDataPelunasan={setDataPelunasan}
          incrementalId={incrementalId}
        />
        <NoteTable
          dataPelunasan={dataPelunasan}
          removeDataPelunasan={removeDataPelunasan}
        />
        <Button
          variant="contained"
          disabled={dataPelunasan.length < 1}
          onClick={handleSubmit}
        >
          Pelunasan
        </Button>
      </Box>
    </Box>
  );
}
