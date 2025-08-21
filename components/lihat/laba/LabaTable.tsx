import { LaporanLaba } from "@/lib/types";
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
import { Fragment } from "react";

interface Column {
  id:
    | "nomor_nota"
    | "tanggal_nota"
    | "nama_client"
    | "kota_client"
    | "total_nota"
    | "laba_nota";
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
    id: "total_nota",
    label: "Total Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "laba_nota",
    label: "Laba Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
];

type LabaTableProps = {
  data: LaporanLaba | null;
};

export default function LabaTable({ data }: LabaTableProps) {
  if (!data) {
    return (
      <Box sx={{ width: "100%", marginY: 2 }}>
        <Typography variant="body1" align="center">
          Tidak ada data yang tersedia.
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
            {Object.keys(data.groupedBySales).map((sales, index) => (
              <Fragment key={index}>
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell colSpan={6}>{sales}</TableCell>
                </TableRow>
                {data.groupedBySales[sales].invoices.map((row, index) => (
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
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell>TOTAL</TableCell>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    {data.groupedBySales[
                      sales
                    ].summary.totalNota.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">
                    {data.groupedBySales[
                      sales
                    ].summary.totalLaba.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              </Fragment>
            ))}
            <TableRow hover role="checkbox" tabIndex={-1}>
              <TableCell colSpan={3} align="center">
                GRAND TOTAL
              </TableCell>
              <TableCell />
              <TableCell align="right">
                {data.grandSummary.grandTotalNota.toLocaleString("id-ID")}
              </TableCell>
              <TableCell align="right">
                {data.grandSummary.grandTotalLaba.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
