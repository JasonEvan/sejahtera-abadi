"use client";

import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { menus } from "./Sidebar";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CustomAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to logout. Please try again.");
      }

      setAnchorEl(null);
      router.replace("/");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred during logout. Please try again.",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <AppBar
      position="static"
      sx={{
        marginBottom: 2,
        display: { xs: "block", sm: "block", md: "none", lg: "none" },
        displayPrint: "none",
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {menus.map((menu) => (
            <MenuItem
              key={menu.label}
              onClick={handleClose}
              component="a"
              href={menu.path}
            >
              {menu.icon}
              <Typography variant="inherit" sx={{ marginLeft: 1 }}>
                {menu.label}
              </Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout}>
            <LogoutIcon />
            <Typography variant="inherit" sx={{ marginLeft: 1 }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: "block", sm: "block" } }}
        >
          Sejahtera Abadi
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
