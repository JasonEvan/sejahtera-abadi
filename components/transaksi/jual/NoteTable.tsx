import { DataPenjualanI, useJualStore } from "@/hooks/useJualStore";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { modals } from "@/lib/modal";
import EditJualForm from "./EditJualForm";

interface Column {
  id: "namaBarang" | "hargaSatuan" | "modal" | "jumlah" | "subtotal" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "namaBarang", label: "Nama Barang", minWidth: 200, align: "left" },
  {
    id: "hargaSatuan",
    label: "Harga Jual",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "modal",
    label: "Modal",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  { id: "jumlah", label: "Quantity", minWidth: 100, align: "right" },
  {
    id: "subtotal",
    label: "Subtotal",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export default function NoteTable() {
  const { dataPenjualan, removeDataPenjualan } = useJualStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (row: DataPenjualanI) => {
    modals.open({
      title: "Edit Item Penjualan",
      type: "form",
      size: "sm",
      children: <EditJualForm row={row} />,
    });
  };

  return (
    <Box sx={{ width: "100%", marginY: 2 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
            {dataPenjualan
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    if (column.id === "action") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <IconButton
                            onClick={() => handleEdit(row)}
                            color="warning"
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => removeDataPenjualan(row.id)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      );
                    }

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
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 50]}
        component="div"
        count={dataPenjualan.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
