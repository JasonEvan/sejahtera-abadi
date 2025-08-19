import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { usePersediaanStore } from "@/hooks/lihat/usePersediaanStore";

interface Column {
  id:
    | "nomor_nota"
    | "tanggal_nota"
    | "nama_client"
    | "kota_client"
    | "tipe"
    | "harga"
    | "qty_in"
    | "qty_out"
    | "qty_akhir";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nomor_nota", label: "Nomor Nota", minWidth: 30, align: "left" },
  {
    id: "tanggal_nota",
    label: "Tanggal Nota",
    minWidth: 50,
    align: "left",
  },
  {
    id: "nama_client",
    label: "Nama",
    minWidth: 50,
    align: "left",
  },
  {
    id: "kota_client",
    label: "Kota",
    minWidth: 50,
    align: "left",
  },
  {
    id: "tipe",
    label: "Tipe",
    minWidth: 25,
    align: "center",
  },
  {
    id: "harga",
    label: "Harga",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "qty_in",
    label: "Qty In",
    minWidth: 50,
    align: "right",
  },
  {
    id: "qty_out",
    label: "Qty Out",
    minWidth: 50,
    align: "right",
  },
  {
    id: "qty_akhir",
    label: "Qty Akhir",
    minWidth: 50,
    align: "right",
  },
];

export default function PersediaanTable() {
  const { data, stockAwal, totalQtyIn, totalQtyOut, finalStock } =
    usePersediaanStore();

  if (data.length === 0) {
    return (
      <Box sx={{ width: "100%", marginY: 2 }}>
        <Typography variant="body1" align="center">
          Tidak ada data persediaan yang tersedia.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", marginY: 2 }}>
      <TableContainer sx={{ maxHeight: 550 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} />
              <TableCell>SALDO AWAL</TableCell>
              <TableCell colSpan={6} align="right">
                {stockAwal}
              </TableCell>
            </TableRow>
            {data.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} />
              <TableCell>TOTAL QTY</TableCell>
              <TableCell colSpan={3} />
              <TableCell align="right">{totalQtyIn}</TableCell>
              <TableCell align="right">{totalQtyOut}</TableCell>
              <TableCell align="right">{finalStock}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
