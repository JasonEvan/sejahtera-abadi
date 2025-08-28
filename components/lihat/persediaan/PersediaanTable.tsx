import {
  Box,
  Divider,
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

export default function PersediaanTable({ barang }: { barang: string }) {
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
      <TableContainer
        sx={{
          maxHeight: 550,
          "@media print": { maxHeight: "none", overflow: "visible" },
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {/* Untuk Print */}
            <TableRow sx={{ display: "none", displayPrint: "table-row" }}>
              <TableCell colSpan={9} sx={{ border: 0 }}>
                <Typography variant="h6" fontWeight="bold">
                  SEJAHTERA ABADI
                </Typography>
                <Typography variant="body2">Semarang</Typography>
                <Typography variant="body2" gutterBottom>
                  Kartu Persediaan {barang}
                </Typography>
                <Divider />
              </TableCell>
            </TableRow>

            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                SALDO AWAL
              </TableCell>
              <TableCell
                colSpan={6}
                align="right"
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                {stockAwal}
              </TableCell>
            </TableRow>
            {data.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                TOTAL QTY
              </TableCell>
              <TableCell
                colSpan={3}
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                align="right"
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                {totalQtyIn}
              </TableCell>
              <TableCell
                align="right"
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                {totalQtyOut}
              </TableCell>
              <TableCell
                align="right"
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                {finalStock}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
