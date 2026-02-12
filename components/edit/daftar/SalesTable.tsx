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
import { salesman } from "@/app/generated/prisma";
import Swal from "sweetalert2";
import EditSalesForm from "./EditSalesForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSalesman, getSalesmen } from "@/service/salesService";
import { AxiosError } from "axios";

interface Column {
  id: "nama_sales" | "no_nota" | "no_telp_sales" | "kode_sales" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nama_sales", label: "Nama Salesman", minWidth: 75, align: "left" },
  {
    id: "no_nota",
    label: "Nomer Nota",
    minWidth: 50,
    align: "right",
  },
  {
    id: "no_telp_sales",
    label: "Nomer Telepon",
    minWidth: 100,
    align: "left",
  },
  {
    id: "kode_sales",
    label: "Kode Sales",
    minWidth: 100,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

export default function SalesTable() {
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
    queryKey: ["salesman"],
    queryFn: getSalesmen,
    staleTime: Infinity,
  });

  const deleteSalesMutation = useMutation({
    mutationFn: deleteSalesman,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["salesman"] });
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
            : "An unexpected error occurred while deleting the salesman.",
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
            : "An unexpected error occurred while fetching salesmen data.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  const handleEdit = (data: salesman) => {
    modals.open({
      title: "Edit Salesman",
      type: "form",
      size: "sm",
      children: (
        <EditSalesForm
          {...data}
          onSaveSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["salesman"] });
            queryClient.invalidateQueries({
              queryKey: ["last-nota", data.nama_sales],
            });
          }}
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
      deleteSalesMutation.mutate(id);
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
