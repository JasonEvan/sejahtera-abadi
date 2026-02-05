import { exportStock } from "@/service/exportService";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const options = [
  "nama_barang",
  "stock_awal",
  "stock_akhir",
  "harga_barang",
  "jual_barang",
  "qty_in",
  "qty_out",
  "satuan_barang",
  "modal",
];

export default function FormField() {
  const [columns, setColumns] = useState<string[]>([]);

  const handleChange = (e: SelectChangeEvent<typeof columns>) => {
    const {
      target: { value },
    } = e;
    setColumns(typeof value === "string" ? value.split(",") : value);
  };

  const exportMutation = useMutation({
    mutationFn: exportStock,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "stock.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Export Successful",
        text: "The stock data has been exported successfully.",
        confirmButtonText: "OK",
      });

      setColumns([]);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "An unexpected error occurred";
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="select-columns-stock">Columns</InputLabel>
        <Select
          labelId="select-columns-stock"
          multiple
          value={columns}
          onChange={handleChange}
          input={<OutlinedInput label="Columns" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        sx={{ width: 150, m: 1 }}
        onClick={() => exportMutation.mutate(columns)}
        loading={exportMutation.isPending}
      >
        Export
      </Button>
    </Box>
  );
}
