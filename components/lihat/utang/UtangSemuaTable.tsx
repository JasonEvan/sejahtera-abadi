import { UtangSemuaDTO, UtangTableRow } from "@/lib/types";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
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

export default function UtangSemuaTable() {
  const [data, setData] = useState<UtangTableRow[]>([]);
  const [summary, setSummary] = useState<{
    totalNilaiNota: string;
    totalLunasNota: string;
    sisaUtang: string;
  }>({
    totalNilaiNota: "0",
    totalLunasNota: "0",
    sisaUtang: "0",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/beli/lihat", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const { data, summary }: UtangSemuaDTO = await response.json();
        setData(data);
        setSummary(summary);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error instanceof Error ? error.message : "Failed to load data",
          confirmButtonText: "OK",
        });
        setData([]);
        setSummary({
          totalNilaiNota: "0",
          totalLunasNota: "0",
          sisaUtang: "0",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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
              <TableCell />
              <TableCell align="right">{summary.totalNilaiNota}</TableCell>
              <TableCell align="right">{summary.totalLunasNota}</TableCell>
              <TableCell />
              <TableCell align="right">{summary.sisaUtang}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
