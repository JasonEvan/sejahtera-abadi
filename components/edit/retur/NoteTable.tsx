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
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { NotaI } from "@/hooks/useReturStore";
import { modals } from "@/lib/modal";
import ReturForm from "@/components/retur/ReturForm";

interface Column {
  id:
    | "nama_barang"
    | "harga_barang"
    | "qty_barang"
    | "retur_barang"
    | "total_harga"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nama_barang", label: "Nama Barang", minWidth: 150, align: "left" },
  {
    id: "harga_barang",
    label: "Harga",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "qty_barang",
    label: "Jumlah",
    minWidth: 100,
    align: "right",
  },
  {
    id: "retur_barang",
    label: "Jumlah Retur",
    minWidth: 100,
    align: "right",
  },
  {
    id: "total_harga",
    label: "Subtotal",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 50,
    align: "center",
  },
];

export default function NoteTable({
  dataNota,
  returBarang,
}: {
  dataNota: NotaI[];
  returBarang: (
    row: NotaI,
    jumlahReturBaru: number,
    jumlahReturSebelum: number
  ) => void;
}) {
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

  const handleEdit = (data: NotaI) => {
    modals.open({
      title: "Retur Beli Barang",
      type: "form",
      size: "sm",
      text: [`Nama Barang: ${data.nama_barang}`, `Jumlah: ${data.qty_barang}`],
      children: <ReturForm row={data} returBarang={returBarang} />,
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
            {dataNota
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
        count={dataNota.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
