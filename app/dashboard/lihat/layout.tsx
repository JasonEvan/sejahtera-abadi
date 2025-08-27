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
import { useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

const stockMenus = [
  {
    label: "Kartu Persediaan",
    icon: <Inventory2OutlinedIcon />,
    href: "/dashboard/lihat/persediaan",
  },
];

const transactionMenus = [
  {
    label: "Utang Semua Langganan",
    icon: <CallMadeOutlinedIcon />,
    href: "/dashboard/lihat/utang",
  },
  {
    label: "Utang per Langganan",
    icon: <CallMadeOutlinedIcon />,
    href: "/dashboard/lihat/utang/langganan",
  },
  {
    label: "Piutang Semua Langganan",
    icon: <CallReceivedOutlinedIcon />,
    href: "/dashboard/lihat/piutang",
  },
  {
    label: "Piutang per Langganan",
    icon: <CallReceivedOutlinedIcon />,
    href: "/dashboard/lihat/piutang/langganan",
  },
];

const notaMenus = [
  {
    label: "Nota Penjualan",
    icon: <ReceiptLongOutlinedIcon />,
    href: "/dashboard/lihat/nota/penjualan",
  },
  {
    label: "Nota Pembelian",
    icon: <ShoppingBasketOutlinedIcon />,
    href: "/dashboard/lihat/nota/pembelian",
  },
];

const profitMenus = [
  {
    label: "Laba",
    icon: <TrendingUpOutlinedIcon />,
    href: "/dashboard/lihat/laba",
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
        <Box
          sx={{ position: "absolute", top: 0, right: 0, displayPrint: "none" }}
        >
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
          {stockMenus.map((menu) => (
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
          {notaMenus.map((menu) => (
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
          {profitMenus.map((menu) => (
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
