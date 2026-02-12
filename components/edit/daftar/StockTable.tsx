import {
  Box,
  CircularProgress,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { modals } from "@/lib/modal";
import { stock } from "@/app/generated/prisma";
import Swal from "sweetalert2";
import EditStockForm from "./EditStockForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBarang, getBarang } from "@/service/barangService";
import { AxiosError } from "axios";

interface Column {
  id:
    | "nama_barang"
    | "harga_barang"
    | "jual_barang"
    | "satuan_barang"
    | "modal"
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
    label: "Harga Beli",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "jual_barang",
    label: "Harga Jual",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "satuan_barang",
    label: "Satuan",
    minWidth: 50,
    align: "left",
  },
  {
    id: "modal",
    label: "Modal",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export default function StockTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["barang"],
    queryFn: getBarang,
    staleTime: Infinity,
  });

  const deleteStockMutation = useMutation({
    mutationFn: deleteBarang,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: data.message,
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof AxiosError
            ? error.response?.data?.error || error.message
            : "An unexpected error occurred while deleting the item.",
        confirmButtonText: "OK",
      });
    },
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof AxiosError
            ? error.response?.data?.error || error.message
            : "An unexpected error occurred while fetching stock data.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  const handleEdit = (data: stock) => {
    modals.open({
      title: "Edit Stock",
      type: "form",
      size: "sm",
      children: (
        <EditStockForm
          {...data}
          onSaveSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["barang"] })
          }
        />
      ),
    });
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteStockMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          marginY: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            {data?.data
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
                            onClick={() => handleDelete(row.id)}
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
        count={data?.data.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
