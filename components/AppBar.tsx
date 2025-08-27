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
import { useState } from "react";
import { menus } from "./Sidebar";

export default function CustomAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
