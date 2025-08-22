import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState, Fragment, useEffect } from "react";

export default function ListHistory({
  history,
  fetchHistory,
}: {
  history: {
    nama_barang: string;
    tanggal_nota: string;
    harga_barang: number;
  }[];
  fetchHistory: (namaBarang: string) => Promise<void>;
}) {
  const [namaBarang, setNamaBarang] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaBarang(event.target.value);
  };

  /**
   * This effect is used for debouncing the search input.
   * It can be used to fetch history based on the input value.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (namaBarang.trim()) {
        fetchHistory(namaBarang);
      }
    }, 500); // Debounce for 500ms

    /**
     * Cleanup function to clear the timeout
     */
    return () => {
      clearTimeout(timeout);
    };
  }, [namaBarang, fetchHistory]);

  return (
    <Box>
      <TextField
        fullWidth
        label="Nama Barang"
        variant="standard"
        name="namabarang"
        value={namaBarang}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
      />

      <List>
        {history.map((item, index) => (
          <Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`${
                  item.nama_barang
                } - Rp${item.harga_barang.toLocaleString("id-ID")}`}
                secondary={item.tanggal_nota}
              />
            </ListItem>
            {index < history.length - 1 && <Divider />}
          </Fragment>
        ))}
        {history.length === 0 && namaBarang && (
          <ListItem>
            <ListItemText primary="Tidak ada data yang cocok." />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
