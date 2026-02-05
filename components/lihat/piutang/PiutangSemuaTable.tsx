import { getPiutang } from "@/service/piutangService";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";

interface Column {
  id:
    | "nama_client"
    | "kota_client"
    | "nomor_nota"
    | "tanggal_nota"
    | "nilai_nota"
    | "lunas_nota"
    | "tanggal_lunas"
    | "saldo_nota";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
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
  { id: "nomor_nota", label: "Nomor Nota", minWidth: 30, align: "left" },
  {
    id: "tanggal_nota",
    label: "Tanggal Nota",
    minWidth: 50,
    align: "left",
  },
  {
    id: "nilai_nota",
    label: "Nilai Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "lunas_nota",
    label: "Lunas Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "tanggal_lunas",
    label: "Tanggal Lunas",
    minWidth: 50,
    align: "left",
  },
  {
    id: "saldo_nota",
    label: "Saldo Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
];

export default function PiutangSemuaTable() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["piutang"],
    queryFn: getPiutang,
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof AxiosError
            ? error.message
            : "An unexpected error occurred while fetching piutang data.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return null;
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
              <TableCell colSpan={8} sx={{ border: 0 }}>
                <Typography variant="h6" fontWeight="bold">
                  SEJAHTERA ABADI
                </Typography>
                <Typography variant="body2">Semarang</Typography>
                <Typography variant="body2" gutterBottom>
                  Laporan Piutang
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
            {data?.data.map((row, index) => (
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
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                colSpan={2}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                TOTAL
              </TableCell>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                align="right"
              >
                {data?.summary.totalNilaiNota}
              </TableCell>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                align="right"
              >
                {data?.summary.totalLunasNota}
              </TableCell>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                align="right"
              >
                {data?.summary.sisaPiutang}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
