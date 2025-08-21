import { DetailTransaksiTableRow } from "@/lib/types";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";

interface Column {
  id:
    | "nomor_nota"
    | "tanggal_nota"
    | "nama_client"
    | "kota_client"
    | "nama_barang"
    | "qty_barang"
    | "harga_barang"
    | "total_harga";
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
    id: "nama_barang",
    label: "Nama Barang",
    minWidth: 100,
    align: "left",
  },
  {
    id: "qty_barang",
    label: "Quantity",
    minWidth: 50,
    align: "right",
  },
  {
    id: "harga_barang",
    label: "Harga Barang",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "total_harga",
    label: "Total Harga",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
];

type NotaTableProps = {
  data: DetailTransaksiTableRow[];
  totalHargaSemua: string;
};

export default function NotaTable({ data, totalHargaSemua }: NotaTableProps) {
  if (data.length === 0) {
    return (
      <Box sx={{ width: "100%", marginY: 2 }}>
        <Typography variant="body1" align="center">
          Tidak ada data transaksi yang tersedia.
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
              <TableCell>TOTAL</TableCell>
              <TableCell colSpan={4} />
              <TableCell align="right">{totalHargaSemua}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
