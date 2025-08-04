"use client";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState } from "react";

const transactionMenus = [
  {
    label: "Jual",
    icon: <SellOutlinedIcon />,
    href: "/dashboard/edit/transaksi/penjualan",
  },
  {
    label: "Beli",
    icon: <AddShoppingCartOutlinedIcon />,
    href: "/dashboard/edit/transaksi/pembelian",
  },
];

const pelunasanMenus = [
  {
    label: "Utang",
    icon: <PaymentOutlinedIcon />,
    href: "/dashboard/edit/pelunasan/utang",
  },
  {
    label: "Piutang",
    icon: <ReceiptLongOutlinedIcon />,
    href: "/dashboard/edit/pelunasan/piutang",
  },
];

const returMenus = [
  {
    label: "Retur Beli",
    icon: <ReplyOutlinedIcon />,
    href: "/dashboard/edit/retur/beli",
  },
  {
    label: "Retur Jual",
    icon: <AssignmentReturnOutlinedIcon />,
    href: "/dashboard/edit/retur/jual",
  },
];

const daftarMenus = [
  {
    label: "Client",
    icon: <GroupOutlinedIcon />,
    href: "/dashboard/edit/daftar/client",
  },
  {
    label: "Salesman",
    icon: <PersonAddOutlinedIcon />,
    href: "/dashboard/edit/daftar/sales",
  },
  {
    label: "Stock",
    icon: <Inventory2OutlinedIcon />,
    href: "/dashboard/edit/daftar/stock",
  },
];

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
        <Box component="main">{children}</Box>
        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={() => setOpen(true)}>
            <MenuOpenIcon />
          </IconButton>
        </Box>
      </Box>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          {transactionMenus.map((menu) => (
            <ListItem key={menu.label} disablePadding>
              <ListItemButton href={menu.href}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {pelunasanMenus.map((menu) => (
            <ListItem key={menu.label} disablePadding>
              <ListItemButton href={menu.href}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {returMenus.map((menu) => (
            <ListItem key={menu.label} disablePadding>
              <ListItemButton href={menu.href}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {daftarMenus.map((menu) => (
            <ListItem key={menu.label} disablePadding>
              <ListItemButton href={menu.href}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
