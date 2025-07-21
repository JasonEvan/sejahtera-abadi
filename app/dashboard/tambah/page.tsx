"use client";

import TambahBarang from "@/components/tambah/TambahBarang";
import TambahClient from "@/components/tambah/TambahClient";
import TambahSalesman from "@/components/tambah/TambahSalesman";
import { Box, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export default function TambahPage() {
  const [activeTabs, setActiveTabs] = useState<
    "Barang" | "Client" | "Salesman"
  >("Barang");

  return (
    <Box sx={{ padding: 2 }}>
      <ToggleButtonGroup
        color="primary"
        value={activeTabs}
        exclusive
        onChange={(e, newValue) => setActiveTabs(newValue)}
        aria-label="Tambah Tabs"
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="Barang">Barang</ToggleButton>
        <ToggleButton value="Client">Client</ToggleButton>
        <ToggleButton value="Salesman">Salesman</ToggleButton>
      </ToggleButtonGroup>

      <Divider />

      {/* Content based tabs */}
      {activeTabs === "Barang" && <TambahBarang />}
      {activeTabs === "Client" && <TambahClient />}
      {activeTabs === "Salesman" && <TambahSalesman />}
    </Box>
  );
}
